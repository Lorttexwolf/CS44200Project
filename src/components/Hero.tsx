import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";

import {Input} from "./ui/input";
import {Button} from "./ui/button";

export default function Hero() {
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 z-50">
                <h1 className="text-white drop-shadow-lg mb-4">
                    Never Be Late to Class Again
                </h1>
                <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto drop-shadow-md">
                    Find and reserve parking spots on campus in seconds. Save time, reduce stress,
                    and never miss a lecture.
                </p>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-6">
                    <div className="flex gap-2 bg-white p-2 rounded-lg shadow-lg">
                        <div className="flex-1 flex items-center gap-2 px-3">
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="size-5 text-gray-400"/>
                            <Input
                                placeholder="Search by building, lot name, or address..."
                                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"/>
                        </div>
                        <Button size="lg">
                            Find Parking
                        </Button>
                    </div>
                </div>

                <p className="text-sm text-gray-200">
                    🎓 Trusted by over 10,000 students across 50+ universities
                </p>
            </div>
        </section>
    );
}
