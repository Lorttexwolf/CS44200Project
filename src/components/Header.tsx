"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark, faMapPin } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Button } from "./ui/button";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <FontAwesomeIcon icon={faMapPin} className="size-6 text-white" />
            </div>
            <span className="text-gray-900">SpotFinder</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition">
              Features
            </a>
            <a href="#locations" className="text-gray-600 hover:text-gray-900 transition">
              Locations
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition">
              How It Works
            </a>
            <a href="#team" className="text-gray-600 hover:text-gray-900 transition">
              Team
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost">Log In</Button>
            <Button>Sign Up</Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <FontAwesomeIcon icon={faXmark} className="size-6 text-gray-900" />
            ) : (
              <FontAwesomeIcon icon={faBars} className="size-6 text-gray-900" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition">
                Features
              </a>
              <a href="#locations" className="text-gray-600 hover:text-gray-900 transition">
                Locations
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition">
                How It Works
              </a>
              <a href="#team" className="text-gray-600 hover:text-gray-900 transition">
                Team
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t">
                <Button variant="ghost" className="w-full">Log In</Button>
                <Button className="w-full">Sign Up</Button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
