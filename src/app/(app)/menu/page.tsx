'use client';

import { useState } from 'react';
import { useStrains } from '@/hooks/useStrains';
import { useAuth } from '@/hooks/useAuth';
import { Strain } from '@/types';
import { useRouter } from 'next/navigation';

const ReservationModal = ({ strain, onClose, onSubmit, loading }: { strain: Strain; onClose: () => void; onSubmit: (grams: number) => Promise<void>; loading: boolean; }) => {
  const [grams, setGrams] = useState('');
  const contribution = strain.contrib * (parseFloat(grams) || 0);

  const handleSubmit = async () => {
    if (parseFloat(grams) > 0) {
      await onSubmit(parseFloat(grams));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-brand-green-dark">Reserve {strain.name}</h2>
        <p className="mb-4 text-gray-700">Contribution: €{strain.contrib.toFixed(2)}/g</p>
        <label htmlFor="grams" className="block text-sm font-medium text-gray-700 mb-1">Grams</label>
        <input id="grams" type="number" step="0.1" value={grams} onChange={(e) => setGrams(e.target.value)} placeholder="e.g., 2.5" className="w-full px-4 py-2 border rounded-md mb-4" />
        <p className="text-lg font-semibold mb-6">Total: €{contribution.toFixed(2)}</p>
        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md">Cancel</button>
          <button onClick={handleSubmit} disabled={loading || !grams || parseFloat(grams) <= 0} className="px-4 py-2 text-white bg-brand-green rounded-md disabled:opacity-50">
            {loading ? 'Reserving...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function MenuPage() {
  const { strains, loading: strainsLoading } = useStrains();
  const { user } = useAuth();
  const [selectedStrain, setSelectedStrain] = useState<Strain | null>(null);
  const [apiMessage, setApiMessage] = useState('');
  const [apiLoading, setApiLoading] = useState(false);
  const router = useRouter();

  const handleReservationSubmit = async (grams: number) => {
    if (!user || !selectedStrain) return;
    setApiLoading(true);
    setApiMessage('');
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ strainId: selectedStrain.id, grams: grams }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to make reservation.');
      setApiMessage(result.message);
      setSelectedStrain(null);
      router.refresh();
    } catch (error: any) {
      setApiMessage(error.message);
    } finally {
      setApiLoading(false);
    }
  };

  if (strainsLoading) return <p>Loading menu...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Club Menu</h1>
      {apiMessage && <div className="bg-blue-100 text-blue-800 p-3 rounded-md">{apiMessage}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {strains.map(strain => (
          <div key={strain.id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">{strain.name}</h2>
            <button onClick={() => { setSelectedStrain(strain); setApiMessage(''); }} className="w-full mt-4 bg-brand-green text-white py-2 rounded-md">Reserve</button>
          </div>
        ))}
      </div>
      {selectedStrain && <ReservationModal strain={selectedStrain} onClose={() => setSelectedStrain(null)} onSubmit={handleReservationSubmit} loading={apiLoading} />}
    </div>
  );
}
