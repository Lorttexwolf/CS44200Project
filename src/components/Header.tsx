"use client";
import { useAuth } from "@/hooks/useAuth";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { UniParkLogoI } from "../Branding";
import { Button } from "./ui/button";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2">
              <Image src={UniParkLogoI} alt="Logo" width={150} height={50} />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/#campuses"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Campuses
            </Link>
            <Link
              href="/#features"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Features
            </Link>
            {/* <Link
              href="/#how-it-works"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              How It Works
            </Link> */}
            <Link
              href="/#team"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Team
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4 ">
            {isAuthenticated ? (
              <>
                <Link href="/profile">
                  <Button variant="ghost" className="cursor-pointer">
                    {user?.firstName || "Profile"}
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  className="cursor-pointe transition-colors hover:bg-white hover:text-black hover:border-black"
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="cursor-pointer">
                    Log In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="cursor-pointer transition-colors hover:bg-white hover:text-black hover:border-black">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <FontAwesomeIcon
                icon={faXmark}
                className="size-6 text-gray-900"
              />
            ) : (
              <FontAwesomeIcon icon={faBars} className="size-6 text-gray-900" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <Link
                href="/#features"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Features
              </Link>
              <Link
                href="/#campuses"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Campuses
              </Link>
              <Link
                href="/#how-it-works"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                How It Works
              </Link>
              <Link
                href="/#team"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Team
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t">
                {isAuthenticated ? (
                  <>
                    <Link href="/profile">
                      <Button variant="ghost" className="w-full">
                        {user?.firstName || "Profile"}
                      </Button>
                    </Link>
                    <Button onClick={handleLogout} className="w-full">
                      Log Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="ghost" className="w-full">
                        Log In
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
