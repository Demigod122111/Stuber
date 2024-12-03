"use client";

import { useEffect, useState } from "react";
import { EnsureLogin, Logout } from "../auth/page";
import Logo from "../assets/images/stuber_logo.png";
import Image from 'next/image';
import { GetUserData, UpdateUserData } from "../modules/misc";

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
                <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
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
                    }} id="changes">
                        <button
                        className="w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
                        type="submit"
                        >
                        Save Changes
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
        content: <p className="text-gray-300">Manage your account settings.</p>,
        },
        notifications: {
        title: 'Notifications',
        content: <>
            <p className="text-gray-300">View your notifications.</p>
        </>,
        },
        security: {
        title: 'Security',
        content: <p className="text-gray-300">Update your password and enable 2FA.</p>,
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