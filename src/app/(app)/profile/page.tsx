'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ProfilePage() {
    const { user, userProfile, loading } = useAuth();
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (userProfile?.name) setName(userProfile.name);
    }, [userProfile?.name]);

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsLoading(true);
        try {
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, { name: name });
            setMessage('Profile updated successfully!');
        } catch (error: any) {
            setMessage(`Failed to update profile: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) return <p>Loading profile...</p>;
    if (!userProfile) return <p>Could not load user data.</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold">Your Profile</h1>
            {message && <div className="bg-blue-100 text-blue-800 p-3 rounded-md my-4">{message}</div>}
            <form onSubmit={handleSaveChanges} className="mt-6 bg-white p-6 rounded-lg shadow-md space-y-6">
                <div>
                    <label className="block text-sm font-medium">Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input type="email" readOnly value={userProfile.email} className="mt-1 block w-full bg-gray-100 px-3 py-2 border rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Membership Status</label>
                    <p className={`mt-1 font-semibold ${userProfile.isApproved ? 'text-green-600' : 'text-orange-500'}`}>
                        {userProfile.isApproved ? 'Approved' : 'Pending Review'}
                    </p>
                </div>
                <div>
                    <button type="submit" disabled={isLoading} className="bg-brand-green text-white px-4 py-2 rounded-md disabled:opacity-50">
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
