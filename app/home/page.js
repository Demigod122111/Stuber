"use client"

import Logo from "../assets/images/stuber_logo.png";
import Image from 'next/image';
import NavBar from '../components/navbar';
import { useState } from "react";


export default function HomePage() {
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <>
            <NavBar />
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
                {/* Hero Section */}
                <header className="relative flex flex-col items-center justify-center text-center h-screen bg-hero-pattern bg-cover bg-center">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="z-10 max-w-3xl">
                        <Image 
                          src={Logo}
                          alt="Stuber Logo"
                        />
                        <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                            Welcome to Stuber
                        </h1>
                        <p className="text-xl text-gray-300 mb-8">
                            Transforming student transportation with seamless rides.
                        </p>
                        <button
                            onClick={() => setModalOpen(true)}
                            className="px-6 py-3 bg-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-500 transition"
                        >
                            Learn More
                        </button>
                    </div>
                </header>

                {/* Features Section */}
                <div className="py-12 px-6 max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-center">
                        Explore Our Features
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature Card */}
                        <FeatureCard
                            title="Book a Ride"
                            description="Effortlessly book rides to your destination."
                            icon="🚗"
                            link="/ride"
                        />
                        <FeatureCard
                            title="Manage Account"
                            description="Update profile, payment methods, and preferences."
                            icon="👤"
                            link="/account"
                        />
                        <FeatureCard
                            title="Ride History"
                            description="Access past rides and invoices easily."
                            icon="📜"
                            onClick={() => sessionStorage.setItem("account-section", "history")}
                            link="/account"
                        />
                        <FeatureCard
                            title="Support"
                            description="24/7 assistance to help you anytime."
                            icon="📞"
                            onClick={() => sessionStorage.setItem("account-section", "support")}
                            link="/account"
                        />
                        <FeatureCard
                            title="Settings"
                            description="Customize your experience with app preferences."
                            icon="⚙️"
                            onClick={() => sessionStorage.setItem("account-section", "settings")}
                            link="/account"
                        />
                        <FeatureCard
                            title="Offers"
                            description="Exclusive student discounts and offers."
                            icon="🎁"
                            link="#offers"
                        />
                    </div>
                </div>

                {/* Modal Section */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 w-screen">
                        <div className="bg-gray-800 text-white rounded-lg p-6 max-w-lg w-2/1 relative">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-300"
                            >
                                ✕
                            </button>
                            <h2 className="text-2xl font-bold mb-4">About Stuber</h2>
                            <p className="text-gray-300 mb-6">
                            Stuber is an innovative, student-focused rideshare platform designed to provide safe, affordable, and efficient transportation solutions for students in university and high school communities. The platform addresses the challenges of unreliable transit options, safety concerns, and budget constraints that students often face, while promoting carpooling to reduce traffic congestion and carbon emissions on campuses.
                            </p>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

function FeatureCard({ title, description, icon, link, onClick }) {
    return (
        <a
            onClick={onClick}
            href={link}
            className="bg-gray-800 hover:bg-gray-700 transition rounded-lg shadow-lg p-6 text-center"
        >
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-gray-400">{description}</p>
        </a>
    );
}
