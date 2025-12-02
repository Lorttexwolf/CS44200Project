import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMapPin, faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {faInstagram, faTwitter, faFacebook} from "@fortawesome/free-brands-svg-icons";

import HorizontalWrap from "./HorizontalWrap";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12">
            <HorizontalWrap>
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* Logo and Description */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <Image src="/logo-TRANSPARENT-White.png" alt="Logo" width={150} height={50}/>
                        </div>
                        <p className="text-sm text-gray-400">
                            Making campus parking simple, affordable, and stress-free for students
                            everywhere.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="text-white mb-4">Product</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="hover:text-white transition">Features</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition">Pricing</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition">Mobile App</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition">Campus Map</a>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-white mb-4">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="hover:text-white transition">About Us</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition">Careers</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition">Partner With Us</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition">Contact</a>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white mb-4">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="hover:text-white transition">Help Center</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition">Student Discount</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition">Terms of Service</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition">Privacy Policy</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div
                    className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-400">
                        © 2025 SpotFinder. All rights reserved.
                    </p>

                    <div className="flex items-center gap-4">
                        <a href="#" className="hover:text-white transition">
                            <FontAwesomeIcon icon={faInstagram} className="size-5"/>
                        </a>
                        <a href="#" className="hover:text-white transition">
                            <FontAwesomeIcon icon={faTwitter} className="size-5"/>
                        </a>
                        <a href="#" className="hover:text-white transition">
                            <FontAwesomeIcon icon={faFacebook} className="size-5"/>
                        </a>
                        <a href="#" className="hover:text-white transition">
                            <FontAwesomeIcon icon={faEnvelope} className="size-5"/>
                        </a>
                    </div>
                </div>
            </HorizontalWrap>
        </footer>
    );
}
