"use client";

import Link from 'next/link';
import Logo from "../assets/images/stuber_logo.png";
import Image from 'next/image';
import { useEffect, useState } from 'react';
import LiveTime from './livetime';
import { EnsureLogin } from '../auth/page';
import { GetUserData } from '../modules/misc';
import "../styles/styles.css";
import { redirect } from 'next/navigation';

export default function NavBar() {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [userData, setUserData] = useState({});

    useEffect(() => {
        EnsureLogin();
        GetUserData(setUserData);
    }); // Testing Dynamic

    const CanShowLink = (link) => {
        return link.show == undefined || link.show();
    }

    const navLinks = [
        { href: "/admin", label: "Admin", show: () => Number(userData["oppermissionlevel"]) >= 4 },
        { href: "/ride", label: "Ride"},
        { href: "/account", label: "Account" },
    ];

    return (
        <nav className="bg-gray-900 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo Section */}
                    <Image 
                        src={Logo} 
                        className="nav-bar-logo cursor-pointer" 
                        alt="Stuber Logo"
                        onClick={() => redirect("/home")}
                    />
    
                    <LiveTime />
    
                    {/* Navigation Links for Desktop */}
                    <div className="hidden md:flex space-x-8 items-center text-lg" key="desktop">
                        {navLinks.map((link) => (
                            CanShowLink(link) ?
                            <Link
                                key={link.href}
                                href={link.href}
                                className="hover:text-blue-400 transition duration-300"
                            >
                                {link.label}
                            </Link>
                            : <></>
                        ))}
                    </div>
    
                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-400 hover:text-white focus:outline-none"
                            aria-label="Toggle navigation"
                        >
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                {isMobileMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16m-7 6h7"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
    
            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-gray-800 text-lg">
                    <div className="space-y-2 px-4 py-4">
                        {navLinks.map((link) => (
                            CanShowLink(link) ?
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block text-gray-300 hover:text-blue-400 transition duration-300"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                            : <></>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
    
}
