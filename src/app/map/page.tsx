'use client';

import Header from '@/components/Header';
import { useParkingLots } from '@/hooks/useParkingLots';
import { ParkingLot } from '@/models/ParkingLot';
import { faMapPin } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import the Map component to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

export default function MapPage() {
    const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null);
    const [L, setL] = useState<any>(null);

    // Fetch parking lots from database (campusId = 1 for now)
    const { parkingLots, loading: loadingLots, error } = useParkingLots(1);

    useEffect(() => {
        // Import Leaflet client-side only
        import('leaflet').then((leaflet) => {
            setL(leaflet.default);

            // Fix for default marker icon
            delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl;
            leaflet
                .default
                .Icon
                .Default
                .mergeOptions({ iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png', iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png' });
        });
    }, []);

    const getAvailabilityColor = (available: number, total: number) => {
        const percentage = (available / total) * 100;
        if (percentage > 30)
            return "bg-green-500";
        if (percentage > 10)
            return "bg-yellow-500";
        return "bg-red-500";
    };

    const getAvailabilityBadge = (available: number, total: number) => {
        const percentage = (available / total) * 100;
        if (percentage > 30)
            return { variant: "default" as const, text: "Available" };
        if (percentage > 10)
            return { variant: "secondary" as const, text: "Limited" };
        return { variant: "destructive" as const, text: "Almost Full" };
    };

    const ParkingCard = ({ lot }: {
        lot: ParkingLot
    }) => {
        const badge = getAvailabilityBadge(lot.AvailableSpots, lot.TotalSpots);
        return (
            <div></div>
        );
    };

    if (!L || loadingLots) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-xl text-gray-600">
                        {!L ? 'Loading map...' : 'Loading parking lots...'}
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-xl text-red-600">Error loading parking lots: {error}</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="w-full" style={{ height: 'calc(100vh - 72px)' }}>
                <MapContainer
                    center={[41.583083, -87.472973]}
                    zoom={16}
                    style={{
                        height: '100%',
                        width: '100%'
                    }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {parkingLots.map((lot, index) => {
                        const badge = getAvailabilityBadge(lot.AvailableSpots, lot.TotalSpots);
                        const allFeatures = Array.from(new Set<string>(lot.Floors.map(f => f.Features).flat()));
                        return (
                            <Marker
                                key={index}
                                position={[lot.Latitude, lot.Longitude]}
                                eventHandlers={{
                                    click: () => setSelectedLot(lot)
                                }}>
                                <Popup maxWidth={300}>
                                    <div className="p-3 min-w-[250px]">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-bold text-gray-900 text-lg">{lot.Name}</h3>
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-semibold ${badge.variant === 'default'
                                                    ? 'bg-green-100 text-green-800'
                                                    : badge.variant === 'secondary'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'}`}>
                                                {badge.text}
                                            </span>
                                        </div>

                                        <div className="space-y-2 mb-3">
                                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                                <FontAwesomeIcon icon={faMapPin} className="size-3" /> {lot.Address}
                                            </p>
                                            {/* <p className="text-sm text-gray-600 flex items-center gap-1">
                                                        <FontAwesomeIcon icon={faLocationArrow} className="size-3"/> {lot.}
                                                        away
                                                    </p> */}
                                        </div>

                                        <div className="mb-3">
                                            <div className="flex items-center justify-between mb-2 text-sm">
                                                <span className="text-gray-600 font-medium">Availability</span>
                                                <span className="text-gray-900 font-semibold">
                                                    {lot.AvailableSpots} of {lot.TotalSpots}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`h-full ${getAvailabilityColor(lot.AvailableSpots, lot.TotalSpots)} transition-all`}
                                                    style={{
                                                        width: `${(lot.AvailableSpots / lot.TotalSpots) * 100}%`
                                                    }} />
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t space-y-1">
                                            {/* <div className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-600">Daily Rate:</span>
                                                        <span className="text-base font-bold text-gray-900">{lot.price}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-600">Hourly Rate:</span>
                                                        <span className="text-sm font-semibold text-gray-900">{lot.hourlyRate}</span>
                                                    </div> */}
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Type:</span>
                                                <span className="text-sm text-gray-900">
                                                    {allFeatures.includes("Covered")
                                                        ? "🏢 Covered"
                                                        : "🌤️ Open Air"}
                                                </span>
                                            </div>
                                        </div>

                                        {lot && allFeatures &&
                                            <div className="mt-3 pt-3 border-t">
                                                <p className="text-sm font-semibold text-gray-900 mb-2">Features:</p>
                                                <div className="flex gap-1.5 flex-wrap">
                                                    {Array.from(allFeatures).map((feature, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-medium">
                                                            {feature}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        }

                                        {lot.Floors && (
                                            <div className="mt-3 pt-3 border-t">
                                                <p className="text-sm font-semibold text-gray-900 mb-2">Floor Availability:</p>
                                                <div className="space-y-2">
                                                    {lot.Floors.map((floor) => {
                                                        const floorPercentage = (floor.AvailableSpots / floor.TotalSpots) * 100;
                                                        return (
                                                            <div key={floor.Floor} className="bg-gray-50 rounded p-2">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="text-xs font-medium text-gray-700">
                                                                        {floor.FloorName}
                                                                    </span>
                                                                    <span className="text-xs font-semibold text-gray-900">
                                                                        {floor.AvailableSpots}/{floor.TotalSpots}
                                                                    </span>
                                                                </div>
                                                                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden mb-1">
                                                                    <div
                                                                        className={`h-full ${getAvailabilityColor(floor.AvailableSpots, floor.TotalSpots)} transition-all`}
                                                                        style={{
                                                                            width: `${floorPercentage}%`
                                                                        }} />
                                                                </div>
                                                                {floor.Features && (
                                                                    <div className="flex gap-1 flex-wrap">
                                                                        {floor.Features.map((feature, idx) => (
                                                                            <span
                                                                                key={idx}
                                                                                className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                                                                                {feature}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>

        </>
    );
}