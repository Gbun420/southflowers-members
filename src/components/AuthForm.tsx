'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { LucideLeaf } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCredential.user.uid), {
            id: userCredential.user.uid,
            email: email,
            name: fullName,
            isApproved: false,
            limits: { dailyUsed: 0, monthlyUsed: 0, lastReset: Timestamp.now() },
        });
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white p-8 rounded-lg shadow-md">
      <form onSubmit={handleAuthAction} className="space-y-4">
        <div className="flex justify-center mb-6">
          <LucideLeaf className="h-10 w-10 text-brand-green" />
        </div>
        {!isLogin && (
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" required className="w-full px-4 py-2 border rounded-md" />
        )}
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required className="w-full px-4 py-2 border rounded-md" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full px-4 py-2 border rounded-md" />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="w-full bg-brand-green text-white py-2 rounded-md disabled:opacity-50">
          {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
        </button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-4 text-sm text-center text-brand-green-dark hover:underline">
        {isLogin ? 'Need an account? Sign Up' : 'Have an account? Sign In'}
      </button>
      <div className="mt-8 text-center text-xs text-brand-gray-dark">
        <p>For Maltese residents 18+ only.</p>
        <p>Complies with ARUC regulations. Club verification required.</p>
      </div>
    </div>
  );
}
