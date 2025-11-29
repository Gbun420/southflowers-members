'use client';

import { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { Stripe, StripeElementsOptions, loadStripe } from '@stripe/stripe-js';
import { CheckoutForm } from './CheckoutForm';
import { auth } from '@/lib/firebase';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const TopUpModal = ({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void; }) => {
  const [amount, setAmount] = useState(10);
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClientSecret = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Authentication required.");
      const token = await user.getIdToken();
      const response = await fetch('/api/stripe-topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ amount }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to initialize payment.');
      setClientSecret(data.clientSecret);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const options: StripeElementsOptions = { clientSecret, appearance: { theme: 'stripe' } };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Top Up Wallet</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {!clientSecret ? (
          <div className="space-y-4">
            <select value={amount} onChange={(e) => setAmount(parseInt(e.target.value))} className="w-full px-3 py-2 border rounded-md">
              <option value={10}>€10</option>
              <option value={25}>€25</option>
              <option value={50}>€50</option>
            </select>
            <button onClick={fetchClientSecret} disabled={loading} className="w-full bg-brand-green text-white py-2 rounded-md">
              {loading ? 'Loading...' : `Proceed`}
            </button>
          </div>
        ) : (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm amount={amount} />
          </Elements>
        )}
        <button onClick={onClose} className="mt-4 w-full text-gray-600">Cancel</button>
      </div>
    </div>
  );
};
