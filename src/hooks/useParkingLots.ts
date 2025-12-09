import { ParkingLot } from '@/models/ParkingLot';
import { useEffect, useState } from 'react';

export function useParkingLots(campusId: number) {
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParkingLots = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/parking-lots?campusId=${campusId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch parking lots');
      }

      const data = await response.json();
      setParkingLots(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (campusId) {
      fetchParkingLots();
    }
  }, [campusId]);

  const createParkingLot = async (lot: ParkingLot) => {
    try {
      const response = await fetch('/api/parking-lots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lot),
      });

      if (!response.ok) {
        throw new Error('Failed to create parking lot');
      }

      await fetchParkingLots(); // Refresh the list
      return await response.json();
    } catch (err) {
      throw err;
    }
  };

  const updateParkingLot = async (id: number, updates: Partial<ParkingLot>) => {
    try {
      const response = await fetch(`/api/parking-lots/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update parking lot');
      }

      await fetchParkingLots(); // Refresh the list
      return await response.json();
    } catch (err) {
      throw err;
    }
  };

  const deleteParkingLot = async (id: number) => {
    try {
      const response = await fetch(`/api/parking-lots/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete parking lot');
      }

      await fetchParkingLots(); // Refresh the list
      return await response.json();
    } catch (err) {
      throw err;
    }
  };

  return {
    parkingLots,
    loading,
    error,
    refetch: fetchParkingLots,
    createParkingLot,
    updateParkingLot,
    deleteParkingLot,
  };
}
