import { useCallback } from 'react';

export function useGoogleMapsDirections() {
    return useCallback((latitude: number, longitude: number): string => {
        return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    }, []);
}
