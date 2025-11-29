'use client';

import { useWallet } from '@/hooks/useWallet';
import { useState, useEffect } from 'react';
import { TopUpModal } from '@/components/TopUpModal';
import { useSearchParams } from 'next/navigation';

export default function WalletPage() {
    const { transactions, balanceInCents, loading: walletLoading } = useWallet();
    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        const status = searchParams.get('redirect_status');
        if (status === 'succeeded') {
            setPaymentStatus("Payment succeeded!");
        }
        if (status === 'failed') {
            setPaymentStatus("Payment failed. Please try again.");
        }
    }, [searchParams]);

    if (walletLoading) return <p>Loading wallet...</p>;
    
    const balanceInEur = (balanceInCents / 100).toFixed(2);

    return (
        <div>
            <h1 className="text-2xl font-bold">Wallet</h1>
            {paymentStatus && <div className="bg-blue-100 text-blue-800 p-3 rounded-md mb-4">{paymentStatus}</div>}
            <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-500">Current Balance</p>
                        <p className="text-3xl font-bold">€{balanceInEur}</p>
                    </div>
                    <button onClick={() => setIsTopUpModalOpen(true)} className="bg-brand-green text-white px-4 py-2 rounded-md">Top Up</button>
                </div>
            </div>
            <div className="mt-8">
                <h2 className="text-xl font-semibold">Transaction History</h2>
                <ul className="mt-4 space-y-4">
                    {transactions.map(tx => (
                        <li key={tx.id} className="bg-white p-4 rounded-md shadow-sm flex justify-between">
                            <div>
                                <p className="font-semibold">{tx.description}</p>
                                <p className="text-sm text-gray-500">{tx.date.toDate().toLocaleDateString()}</p>
                            </div>
                            <p className={`font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-gray-800'}`}>
                              {tx.amount > 0 ? '+' : ''}€{(tx.amount / 100).toFixed(2)}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
            <TopUpModal isOpen={isTopUpModalOpen} onClose={() => setIsTopUpModalOpen(false)} onSuccess={() => { setIsTopUpModalOpen(false); }} />
        </div>
    );
}
