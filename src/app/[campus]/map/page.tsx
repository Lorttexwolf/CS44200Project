'use client';

import { useCampus } from '@/hooks/useCampuses';
import { useParkingLots } from '@/hooks/useParkingLots';
import { ParkingLot } from '@/models/ParkingLot';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { useEffect, useState, use } from 'react';
import Link from 'next/link';

// Dynamically import the Map component to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });
const ZoomControl = dynamic(() => import('react-leaflet').then((mod) => mod.ZoomControl), { ssr: false });

export default function CampusMapPage({ params }: { params: Promise<{ campus: string }> }) {
    const { campus: campusParam } = use(params);
    const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null);
    const [L, setL] = useState<any>(null);
    const [isMounted, setIsMounted] = useState(false);

    const { campus, loading: campusLoading } = useCampus(campusParam);
    const { parkingLots, loading: lotsLoading, error } = useParkingLots(campus?.ID || 0);

    useEffect(() => {
        setIsMounted(true);
        // Import Leaflet client-side only
        import('leaflet').then((leaflet) => {
            setL(leaflet.default);

            // Fix for default marker icon
            delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl;
            leaflet
                .default
                .Icon
                .Default
                .mergeOptions({ 
                    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png', 
                    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png', 
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png' 
                });
        });
    }, []);

    const getAvailabilityColor = (available: number, total: number) => {
        const percentage = (available / total) * 100;
        if (percentage > 30) return "bg-green-500";
        if (percentage > 10) return "bg-yellow-500";
        return "bg-red-500";
    };


    if (campusLoading || !campus) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading campus...</div>
            </div>
        );
    }

    if (!L || lotsLoading || !isMounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-gray-600">
                    {!L || !isMounted ? 'Loading map...' : 'Loading parking lots...'}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-red-600">Error loading parking lots: {error}</div>
            </div>
        );
    }

    // Calculate center from parking lots or use default
    const center: [number, number] = parkingLots.length > 0 
        ? [parkingLots[8].Latitude, parkingLots[8].Longitude]
        : [41.580083, -87.472973];

    return (
        <div className="w-full relative" style={{ height: 'calc(100vh - 72px)' }}>
            {/* Back to Campus Link */}
            <div className="absolute top-6 Left-6 z-40 p-3">
                <Link 
                    href={`/${campusParam}`}
                    className="bg-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
                >
                    <span>←</span>
                    <span>Back to {campus?.Name || 'Campus'}</span>
                </Link>
            </div>

            <MapContainer
                center={center}
                zoom={16}
                style={{
                    height: '100%',
                    width: '100%',
                    zIndex: 0
                }}
                scrollWheelZoom={true}
                zoomControl={false}
            >
                <ZoomControl position="bottomleft" />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {parkingLots.map((lot: ParkingLot, index: number) => (
                    <Marker
                        key={index}
                        position={[lot.Latitude, lot.Longitude]}
                        eventHandlers={{
                            click: () => setSelectedLot(lot)
                        }}
                    >
                        <Popup>
                            <div className="p-2 min-w-[250px]">
                                <h3 className="font-bold text-lg mb-2">{lot.Name}</h3>
                                {lot.ImageFileName && (
                                    <div className="mb-3">
                                        <img 
                                            src={`/api/images/${lot.ImageFileName}`}
                                            alt={lot.Name}
                                            className="w-full h-32 object-cover rounded"
                                        />
                                    </div>
                                )}
                                <p className="text-sm text-gray-600 mb-3">{lot.Address}</p>

                                <div className="mb-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium">Overall Availability</span>
                                        <span className="text-sm font-bold">
                                            {lot.AvailableSpots}/{lot.TotalSpots}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-full rounded-full ${getAvailabilityColor(lot.AvailableSpots, lot.TotalSpots)}`}
                                            style={{ width: `${(lot.AvailableSpots / lot.TotalSpots) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {lot.Floors && lot.Floors.length > 1 && (
                                    <div className="border-t pt-2">
                                        <p className="text-xs font-semibold mb-2">Floor Availability:</p>
                                        {lot.Floors.map((floor, idx: number) => (
                                            <div key={idx} className="mb-2">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs">{floor.FloorName}</span>
                                                    <span className="text-xs font-medium">
                                                        {floor.AvailableSpots}/{floor.TotalSpots}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                    <div
                                                        className={`h-full rounded-full ${getAvailabilityColor(floor.AvailableSpots, floor.TotalSpots)}`}
                                                        style={{ width: `${(floor.AvailableSpots / floor.TotalSpots) * 100}%` }}
                                                    />
                                                </div>
                                                {floor.Features && floor.Features.length > 0 && (
                                                    <div className="flex gap-1 mt-1 flex-wrap">
                                                        {floor.Features.map((feature: string, idx: number) => (
                                                            <span key={idx} className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                                                                {feature}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
