'use client';

import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

import { Input } from "./ui/input";

import { useParkingLots } from "@/hooks/useParkingLots";
import Link from "next/link";
import { Button } from "./ui/button";

interface HeroProps {
    campusID: number;
    campusName: string;
    campusShortName: string;
    videoURL: string;
}

export default function Hero({ campusID, campusName, campusShortName, videoURL }: HeroProps) {
    const [searchQuery,
        setSearchQuery] = useState("");
    const [showPreview,
        setShowPreview] = useState(false);
    const { parkingLots, loading } = useParkingLots(campusID);

    const filteredLots = parkingLots.filter(lot => lot.Name.toLowerCase().includes(searchQuery.toLowerCase()) || lot.Address.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            setShowPreview(true);
        }
    };

    return (
        <section
            className="relative flex items-center justify-center pt-16"
            style={{ minHeight: '50vh' }}>
            {/* Background image */}
            <div className="absolute inset-0 z-10">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute top-0 left-0 w-full h-full object-cover brightness-50 z-0">
                    <source src={videoURL} type="video/mp4" />
                </video>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 z-20">
                <div className="mb-8 overflow-visible">
                    <h1 className="text-white text-4xl sm:text-5xl md:text-7xl font-bold drop-shadow-2xl">
                        {campusName}
                    </h1>
                </div>
                <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto drop-shadow-md">
                    Find parking spots at {campusName} in seconds. Save time, reduce stress,
                    and never miss a lecture.
                </p>

                {/* Search Bar */}
                <div className="flex gap-2 mx-auto mb-6 w-fit">

                    <div className="w-full lg:w-2xl relative">
                        <div className="flex gap-2 bg-white p-2 rounded-lg shadow-lg">
                            <div className="flex-1 flex items-center gap-2 px-3">
                                <FontAwesomeIcon icon={faMagnifyingGlass} className="size-5 text-gray-400" />
                                <Input
                                    placeholder="Search by building, lot name, or address..."
                                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setShowPreview(e.target.value.length > 0);
                                    }}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
                            </div>

                        </div>

                        {/* Preview Dropdown */}
                        {showPreview && searchQuery && (
                            <div
                                className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-2xl overflow-hidden z-30 max-h-96 overflow-y-auto">
                                {loading
                                    ? (
                                        <div className="p-4 text-center text-gray-500">Loading...</div>
                                    )
                                    : filteredLots.length > 0
                                        ? (
                                            <div className="divide-y">
                                                {filteredLots.map((lot, index) => {
                                                    const availablePercentage = (lot.AvailableSpots / lot.TotalSpots) * 100;
                                                    const statusColor = availablePercentage > 30
                                                        ? 'text-green-600'
                                                        : availablePercentage > 10
                                                            ? 'text-yellow-600'
                                                            : 'text-red-600';

                                                    return (
                                                        <div
                                                            key={index}
                                                            className="p-4 hover:bg-gray-50 transition-colors">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex-1">
                                                                    <h4 className="font-semibold text-gray-900 text-left">{lot.Name}</h4>
                                                                    <p className="text-sm text-gray-500 text-left">{lot.Address}</p>
                                                                </div>
                                                                <div className="text-right ml-4">
                                                                    <p className={`font-bold ${statusColor}`}>
                                                                        {lot.AvailableSpots}
                                                                        spots
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        of {lot.TotalSpots}
                                                                        total
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )
                                        : (
                                            <div className="p-4 text-center text-gray-500">
                                                No parking lots found matching "{searchQuery}"
                                            </div>
                                        )}
                            </div>
                        )}
                    </div>

                    <div className="text-center">
                        <Link href={`/${campusShortName}/map`}>
                            <Button size="lg" className="px-8 border-2 h-full  hover:border-black transition-colors hover:bg-white hover:text-black cursor-pointer">
                                View Map
                            </Button>
                        </Link>
                    </div>

                </div>

            </div>
        </section>
    );
}
