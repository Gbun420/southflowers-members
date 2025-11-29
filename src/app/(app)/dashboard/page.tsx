'use client';

import { useAuth } from '@/hooks/useAuth';
import QRCode from 'qrcode.react';

const Progress = ({ value, max, label }: { value: number; max: number; label: string; }) => {
    const percentage = Math.min(100, (value / max) * 100);
    return (
        <div>
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <span className="text-sm font-medium text-gray-500">{value.toFixed(1)}g / {max}g</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-brand-green h-4 rounded-full" style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

export default function DashboardPage() {
  const { user, userProfile, loading } = useAuth();

  if (loading) return <p>Loading dashboard...</p>;
  if (!user || !userProfile) return <p>Could not load user data.</p>;

  return (
    <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-lg font-semibold mb-4">Your Member ID</h2>
        <div className="flex justify-center p-4 bg-white">
            <QRCode value={user.uid} size={200} level="H" />
        </div>
        <p className="mt-4 text-sm text-gray-500">Show this QR at the club.</p>
      </div>
      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Your ARUC Limits</h2>
        <div className="space-y-6">
          <Progress value={userProfile.limits?.dailyUsed || 0} max={7} label="Daily Limit" />
          <Progress value={userProfile.limits?.monthlyUsed || 0} max={50} label="Monthly Limit" />
        </div>
      </div>
    </div>
  );
}
