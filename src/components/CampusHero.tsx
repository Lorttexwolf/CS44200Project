'use client';

import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";

import { Input } from "./ui/input";

import { useCampuses } from "@/hooks/useCampuses";
import { RotatingText } from "./ui/shadcn-io/rotating-text";

interface CampusHeroProps {
    videoURL: string;
}

export default function CampusHero({ videoURL }: CampusHeroProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [showPreview, setShowPreview] = useState(false);
    const { campuses, loading } = useCampuses();

    const filteredCampuses = campuses.filter(campus => 
        campus.Name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        campus.ShortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (campus.Description && campus.Description.toLowerCase().includes(searchQuery.toLowerCase()))
    ).slice(0, 5);

    const handleSearch = () => {
        if (searchQuery.trim() && filteredCampuses.length > 0) {
            window.location.href = `/${filteredCampuses[0].ShortName}`;
        }
    };

    return (
        <section className="relative min-h-[92vh] flex items-center justify-center pt-16">
            {/* Background video */}
            <div className="absolute inset-0 z-10">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute top-0 left-0 w-full h-full object-cover brightness-50 z-0">
                    <source src={videoURL} type="video/mp4"/>
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
                    Find parking spots at your campus in seconds. Save time, reduce stress,
                    and never miss a lecture.
                </p>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-6 relative">
                    <div className="flex gap-2 bg-white p-2 rounded-lg shadow-lg">
                        <div className="flex-1 flex items-center gap-2 px-3">
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="size-5 text-gray-400"/>
                            <Input
                                placeholder="Search by Campus"
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
                        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-2xl overflow-hidden z-30 max-h-96 overflow-y-auto">
                            {loading ? (
                                <div className="p-4 text-center text-gray-500">Loading...</div>
                            ) : filteredCampuses.length > 0 ? (
                                <div className="divide-y">
                                    {filteredCampuses.map((campus) => (
                                        <Link
                                            key={campus.ID}
                                            href={`/${campus.ShortName}`}
                                            className="block p-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900 text-left">{campus.Name}</h4>
                                                    {campus.Description && (
                                                        <p className="text-sm text-gray-500 text-left">{campus.Description}</p>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <span className="text-sm font-medium text-blue-600">
                                                        View Campus →
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 text-center text-gray-500">
                                    No campuses found matching "{searchQuery}"
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div id="features"/>
                {/* <p className="text-sm text-gray-200">
                    🎓 Trusted by students across multiple universities
                </p> */}
            </div>
        </section>
    );
}
