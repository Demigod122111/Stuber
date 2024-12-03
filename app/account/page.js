"use client";

import { useEffect, useState } from "react";
import { EnsureLogin, Logout } from "../auth/page";
import Logo from "../assets/images/stuber_logo.png";
import Image from 'next/image';
import { GetUserData, UpdateUserData } from "../modules/misc";
import Link from "next/link";

export default function Account()
{
    const [selectedSection, setSelectedSection] = useState('profile');
    const [userData, setUserData] = useState({});

    const [editMode, setEditMode] = useState(false);

    const [name, setName] = useState("");

    useEffect(() => {
        EnsureLogin();
        GetUserData(setUserData, {"name": setName});
    }, []);

    const sections = {
        profile: {
            title: 'Profile',
            content: (
                <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w mx-auto">
                <div className="flex flex-col items-center space-y-4">
                    {/* Profile Picture */}
                    <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                    {/* Replace with an actual profile image */}
                    <span className="text-gray-400 text-2xl font-bold">{name == '' ? "?" : name[0].toUpperCase()}</span>
                    </div>
            
                    {/* Profile Information */}
                    <div className="text-center space-y-2">
                    {editMode
                    ? <input
                            type="text"
                            value={name}
                            onChange={({target}) => {
                                setName(target.value);
                            }}
                            form="changes"
                            className="text-2xl font-semibold bg-transparent text-white border-none focus:outline-none focus:ring-0 text-center"
                            required={true}
                        />
                    : <h1 className="text-2xl font-semibold">{name}</h1>
                    }
                    <p className="text-gray-400">{userData["email"]}</p>
                    </div>
            
                    {/* Edit Profile Button */
                    editMode
                    ?
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        UpdateUserData("name", name);

                        setEditMode(false);
                    }} id="changes" className="flex flex-col gap-4" style={{width: "50%"}}>
                            <button
                            className="w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
                            type="submit"
                            >
                            Save Changes
                            </button>

                            <button
                            className="w-full bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300 ease-in-out"
                            type="reset"
                            onClick={() => {setName(userData["name"]); setEditMode(false);}}
                            >
                            Cancel
                            </button>
                    </form>
                    : <button
                    className="w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
                    onClick={() => setEditMode(true)}
                    >
                    Edit Profile
                    </button>
                    }

                    {/* Logout Button */}
                    <button
                    className="w-full bg-gray-800 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out"
                    onClick={Logout}
                    >
                    Logout
                    </button>
                </div>
                </div>
            ),
        },          
        settings: {
            title: 'Settings',
            content: (
                <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w mx-auto">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span>Change Email</span>
                            <button className="bg-blue-600 px-4 py-2 rounded-lg text-white hover:bg-blue-700">
                                Edit
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Change Phone Number</span>
                            <button className="bg-blue-600 px-4 py-2 rounded-lg text-white hover:bg-blue-700">
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            ),
        },
        notifications: {
            title: 'Notifications',
            content: (
                <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w mx-auto">
                    <div className="space-y-4">
                        <label className="flex items-center space-x-4">
                            <input
                                type="checkbox"
                                className="form-checkbox h-5 w-5 text-blue-600 bg-gray-800 border-gray-700 rounded"
                            />
                            <span>Email Notifications</span>
                        </label>
                        <label className="flex items-center space-x-4">
                            <input
                                type="checkbox"
                                className="form-checkbox h-5 w-5 text-blue-600 bg-gray-800 border-gray-700 rounded"
                            />
                            <span>SMS Notifications</span>
                        </label>
                    </div>
                </div>
            ),
        },
        security: {
            title: 'Security',
            content: (
                <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w mx-auto">
                    <div className="space-y-4">
                        <p>Coming soon...</p>
                    </div>
                </div>
            ),
        },
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-gray-900 text-white">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4 bg-gray-800 p-5 shadow-lg lg:h-full">
            <div className="flex lg:flex-col justify-between items-center">
                <Image
                src={Logo}
                alt="Stuber Logo"
                style={{
                    width: '40%',
                    height: 'auto',
                    objectFit: 'contain', // Ensures the image fits within the parent container
                }}
                />
                <h1 className="text-2xl font-bold mb-6">Account</h1>
            </div>
            <ul className="flex lg:flex-col justify-around lg:justify-start items-center lg:items-start space-y-0 lg:space-y-4 overflow-x-auto pb-2">
                <li
                key="home"
                className="cursor-pointer p-3 rounded-lg transition text-center lg:text-left text-gray-400"
                >
                    <Link href="/home">Home</Link>
                </li>
            {Object.keys(sections).map((sectionKey) => (
                <li
                key={sectionKey}
                className={`cursor-pointer p-3 rounded-lg transition text-center lg:text-left ${
                    selectedSection === sectionKey
                    ? 'bg-gray-900 text-white'
                    : 'hover:bg-gray-700 text-gray-400'
                }`}
                onClick={() => setSelectedSection(sectionKey)}
                >
                {sections[sectionKey].title}
                </li>
            ))}
            </ul>

          </div>
      
          {/* Section Content */}
          <div className="flex-1 p-8">
            <h2 className="text-3xl font-semibold mb-4">{sections[selectedSection].title}</h2>
            {sections[selectedSection].content}
          </div>
        </div>
      );      
}