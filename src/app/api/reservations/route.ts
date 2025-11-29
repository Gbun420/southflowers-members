import { NextResponse, NextRequest } from 'next/server';
import { db as adminDb, auth as adminAuth } from '@/lib/firebase-admin';
import { UserProfile, Strain } from '@/types';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('Authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const idToken = authorization.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const { strainId, grams } = await request.json();
    if (!strainId || !grams || grams <= 0) {
      return NextResponse.json({ error: 'Missing or invalid data.' }, { status: 400 });
    }

    const strainRef = adminDb.collection('strains').doc(strainId);
    const userRef = adminDb.collection('users').doc(uid);

    const result = await adminDb.runTransaction(async (t) => {
      const strainDoc = await t.get(strainRef);
      const userDoc = await t.get(userRef);

      if (!strainDoc.exists || !userDoc.exists) throw new Error('User or Strain not found.');
      
      const strain = strainDoc.data() as Strain;
      const user = userDoc.data() as UserProfile;
      const contributionCost = strain.contrib * grams;
      const now = FieldValue.serverTimestamp();

      if ((user.limits.dailyUsed + grams) > 7.0 || (user.limits.monthlyUsed + grams) > 50.0) {
        throw new Error('Reservation exceeds usage limits.');
      }

      const reservationRef = adminDb.collection('reservations').doc();
      t.set(reservationRef, {
        userId: uid, strainId, strainName: strain.name, grams, contributionAmount: contributionCost, date: now, status: 'pending',
      });

      const transactionRef = adminDb.collection('transactions').doc();
      t.set(transactionRef, {
        userId: uid, amount: -Math.round(contributionCost * 100), date: now, type: 'contribution', description: `Reserved ${grams}g of ${strain.name}`,
      });

      t.update(userRef, { 
        'limits.dailyUsed': FieldValue.increment(grams),
        'limits.monthlyUsed': FieldValue.increment(grams)
      });

      return { success: true, message: `Successfully reserved ${grams}g of ${strain.name}!` };
    });

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Reservation API Error:", error);
    return NextResponse.json({ error: error.message || 'An internal error occurred.' }, { status: 500 });
  }
}
