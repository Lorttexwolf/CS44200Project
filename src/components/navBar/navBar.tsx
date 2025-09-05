import Link from "next/link";
import Image from "next/image";
import HorizontalWrap from "../HorizontalWrap";

export default function Navbar() {
    return (
        <nav
            className="w-full flex items-center sticky top-0 z-50 bg-gray-100 shadow-sm py-2">

            <HorizontalWrap>

                <div className="flex items-center justify-between w-full">
                    {/* Logo + Text */}
                    <div className="flex items-center space-x-3">
                        <Link href="/" className="flex items-center space-x-2">
                            <Image
                                src="/pnw-lion.png"
                                alt="PNW Lion"
                                className="w-12 h-12 object-contain"
                                width={48}
                                height={48} />
                            <h1 className="text-xl font-bold text-gray-800">
                                PNW Parking
                            </h1>
                        </Link>
                    </div>

                    <div className="flex space-x-6">
                        {/* <Link
                            href="/aboutUs"
                            className="px-3 py-1 rounded-full text-gray-700 transition-all duration-200 hover:bg-gray-300 ">
                            About Us
                        </Link>
                        <Link
                            href="/contact"
                            className="px-3 py-1 rounded-full text-gray-700 transition-all duration-200 hover:bg-gray-300 ">
                            Contact
                        </Link> */}
                    </div>

                </div>

            </HorizontalWrap>

        </nav>
    );
}
