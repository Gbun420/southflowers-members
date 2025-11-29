'use client';

import { auth } from '@/lib/firebase';
import { Hourglass, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PendingApprovalPage() {
  const router = useRouter();
  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/login');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
        <Hourglass className="w-16 h-16 text-orange-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800">Awaiting Approval</h1>
        <p className="mt-2 text-gray-600">Your account is pending review by an administrator.</p>
        <div className="mt-8 space-x-4">
            <a href="mailto:support@southflowers.mt" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md">Contact Support</a>
            <button onClick={handleSignOut} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">
                <LogOut className="inline w-4 h-4 mr-2" />
                Sign Out
            </button>
        </div>
    </div>
  );
}
