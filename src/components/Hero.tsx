'use client';

import {useState, useEffect} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {parkHero} from "../Branding";

import {Input} from "./ui/input";

import {useParkingLots} from "@/hooks/useParkingLots";
import {RotatingText} from "./ui/shadcn-io/rotating-text";

export default function Hero() {
    const [searchQuery,
        setSearchQuery] = useState("");
    const [showPreview,
        setShowPreview] = useState(false);
    const {parkingLots, loading} = useParkingLots(1);




    const filteredLots = parkingLots.filter(lot => lot.name.toLowerCase().includes(searchQuery.toLowerCase()) || lot.address.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            setShowPreview(true);
        }
    };

    return (
        <section
            className="relative min-h-screen flex items-center justify-center pt-16">
            {/* Background image */}
            <div className="absolute inset-0 z-10">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute top-0 left-0 w-full h-full object-cover brightness-50 z-0">
                    <source src="/lotVid.mp4" type="video/mp4"/>
                </video>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 z-20">
                <div className="mb-8 overflow-visible">
                    <h1 className="text-white text-4xl sm:text-5xl md:text-7xl font-bold drop-shadow-2xl flex flex-col items-center justify-center gap-2 overflow-visible">
                        <span className="tracking-tight">Never Be</span>
                        <span className="relative inline-block min-w-40 sm:min-w-[200px] md:min-w-[280px] lg:min-w-[320px]">
                            <RotatingText
                                text={["Late", "Stressed", "Lost", "Frustrated", "Stuck", "Worried", "Rushing", "Anxious"]}
                                duration={2500}
                                className="bg-linear-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent font-extrabold"
                                transition={{
                                duration: 0.5,
                                ease: "easeInOut"
                            }}/>
                        </span>
                        <span className="text-5xl sm:text-6xl md:text-8xl font-black bg-linear-to-r from-white via-blue-100 to-white bg-clip-text text-transparent tracking-tight pb-3">
                            Again
                        </span>
                    </h1>
                </div>
                <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto drop-shadow-md">
                    Find parking spots on campus in seconds. Save time, reduce stress,
                    and never miss a lecture.
                </p>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-6 relative">
                    <div className="flex gap-2 bg-white p-2 rounded-lg shadow-lg">
                        <div className="flex-1 flex items-center gap-2 px-3">
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="size-5 text-gray-400"/>
                            <Input
                                placeholder="Search by building, lot name, or address..."
                                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                value={searchQuery}
                                onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowPreview(e.target.value.length > 0);
                            }}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}/>
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
                                                const availablePercentage = (lot.available / lot.total) * 100;
                                                const statusColor = availablePercentage > 30
                                                    ? 'text-green-600'
                                                    : availablePercentage > 10
                                                        ? 'text-yellow-600'
                                                        : 'text-red-600';

                                                return (
                                                    <div
                                                        key={index}
                                                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                                        onClick={() => window.location.href = '/map'}>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-gray-900 text-left">{lot.name}</h4>
                                                                <p className="text-sm text-gray-500 text-left">{lot.address}</p>
                                                            </div>
                                                            <div className="text-right ml-4">
                                                                <p className={`font-bold ${statusColor}`}>
                                                                    {lot.available}
                                                                    spots
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    of {lot.total}
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

                <p className="text-sm text-gray-200">
                    🎓 Trusted by 2 students across 1 universiy
                </p>
            </div>
        </section>
    );
}
