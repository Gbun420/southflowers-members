import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      throw new Error("GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable is not set.");
    }
    
    const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin SDK initialized successfully.");
  } catch (error: any) {
    console.error("Error initializing Firebase Admin SDK:", error.message);
  }
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
