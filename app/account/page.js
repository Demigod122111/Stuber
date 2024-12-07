"use client";

import { useEffect, useState } from "react";
import { EnsureLogin, Logout } from "../auth/page";
import Logo from "../assets/images/stuber_logo.png";
import Image from 'next/image';
import { GetUserData, UpdateUserData } from "../modules/misc";
import Link from "next/link";
import { UploadImageM, UploadImageS } from "../components/fileupload";
import { sql } from "../modules/database";
import { decryptPassword, encryptPassword } from "../modules/security";
import { FullScreenImageViewer } from "../admin/identity-reviews/page";

const savedSection = () => {
    const sec = sessionStorage.getItem("account-section");
    if (sec == undefined || sec == null) 
        return "profile";
    sessionStorage.removeItem("account-section");
    return sec;
}

export default function Account()
{
    const [selectedSection, setSelectedSection] = useState('profile');
    const [userData, setUserData] = useState({});

    const [editMode, setEditMode] = useState(false);

    const [name, setName] = useState("");
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [profilePic, setProfilePic] = useState("");

    const [viewing, setViewing] = useState("");

    const [verificationImages, setVerificationImages] = useState([]);

    const [supportMsg, setSupportMsg] = useState("");
    const [securityMsg, setSecurityMsg] = useState("");

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        EnsureLogin();
        GetUserData(setUserData, {"name": setName, "emailnotifications": setEmailNotifications, "profilepic": setProfilePic});
        
        setSelectedSection(savedSection());
    }, []);

    useEffect(() => {
        if (supportMsg == "") return;
        setTimeout(() => {
            setSupportMsg("");
        }, 10000);
    }, [supportMsg])

    useEffect(() => {
        if (securityMsg == "") return;
        setTimeout(() => {
            setSecurityMsg("");
        }, 10000);
    }, [securityMsg])

    const CanShowSection = (section) => {
        return section.show == undefined || section.show();
    }

    const completeVerification = () => {
        UpdateUserData("identitydocuments", JSON.stringify(verificationImages)).then(() => {
            UpdateUserData("identityverified", "in progress").then(() => window.location.reload())
        });
    }

    const handlePasswordChange = (e) => {
        e.preventDefault();
    
        // Validate new password and confirmation match
        if (newPassword !== confirmPassword) {
            setSecurityMsg('New password and confirmation do not match!');
            return;
        }
    
        // Prepare data for the backend
        const passwordData = {
            currentPassword,
            newPassword,
        };
    
        decryptPassword(userData["uid"], userData["password"]).then((curr) => {
            if (passwordData.currentPassword == curr)
                encryptPassword(userData["uid"], passwordData.newPassword).then((val) => {
                    UpdateUserData("password", JSON.stringify(val))
                    .then(() => setSecurityMsg("Password Changed!"))
                    .catch((err) => setSecurityMsg(JSON.stringify(err)))
                })
            else
            {
                setSecurityMsg("Current Password is not the same as provided!");
                setCurrentPassword(passwordData.currentPassword);
                setNewPassword(passwordData.newPassword);
                setConfirmPassword(passwordData.newPassword);
            }
        }) 
        
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const ensureValidSection = () => {
        if (!Object.keys(sections).includes(selectedSection))
            setSelectedSection("profile");
    }

    const sections = {
        profile: {
            title: 'Profile',
            content: (
                <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w mx-auto">
                <div className="flex flex-col items-center space-y-4">
                    {/* Profile Picture */}
                    <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                    {/* Replace with an actual profile image */}
                    {
                        (profilePic != undefined && profilePic != null && profilePic.trim() != "")
                        ? <Image 
                            src={profilePic} 
                            width={16} 
                            height={16} 
                            className="w-full h-full rounded-full cursor-pointer" 
                            onClick={({target}) => setViewing(target.src)}
                            alt="User Profile Picture"
                        />
                        : <span className="text-gray-400 text-2xl font-bold">{name == '' ? "?" : name[0].toUpperCase()}</span>
                    }

                    {viewing != "" && (
                        <FullScreenImageViewer
                            imageUrl={viewing}
                            onClose={() => setViewing("")}
                        />
                    )}
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
                    <p className="text-gray-400 px-2 py-2 rounded-xl bg-gray-800 font-semibold">{userData["role"]}</p>
                    </div>
            
                    {/* Edit Profile Button */
                    editMode
                    ?
                    <>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        UpdateUserData("name", name);
                        UpdateUserData("profilepic", profilePic);

                        setEditMode(false);
                    }} id="changes" className="flex flex-col gap-4" style={{width: "50%"}}>
                            <div className="flex gap-4 overflow-x-auto">
                                <UploadImageS 
                                    label="Change Profile Picture" 
                                    onUpload={(dataUrl) => {
                                        setProfilePic(dataUrl);
                                    }}
                                    showPreview={false}
                                />

                                <button
                                    className="bg-gray-800 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out"
                                    type="button"
                                    onClick={() => setProfilePic("")}
                                >
                                Remove Picture
                                </button>
                            </div>

                            <button
                            className="w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
                            type="submit"
                            >
                            Save Changes
                            </button>

                            <button
                            className="w-full bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300 ease-in-out"
                            type="reset"
                            onClick={() => {setName(userData["name"]); setProfilePic(userData["profilepic"]); setEditMode(false);}}
                            >
                            Cancel
                            </button>
                    </form>
                    </>
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
                        <p>Coming soon...</p>
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
                                checked={emailNotifications != false}
                                onChange={({target}) => {
                                    setEmailNotifications(target.checked);
                                    UpdateUserData("emailnotifications", target.checked);
                                }}
                            />
                            <span>Email Notifications</span>
                        </label>
                    </div>
                </div>
            ),
        },
        security: {
            title: 'Security',
            content: (
                <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w mx-auto">
                    <p className="mb-4">Manage your account security settings below:</p>

                    {securityMsg != '' ? <div className="py-4"><strong className="border-l border-gray-700 px-2 py-2 text-center text-sm">{securityMsg}</strong></div> : <></> }

                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="current-password">
                                Current Password
                            </label>
                            <input
                                type="password"
                                id="current-password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="new-password">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="confirm-password">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                id="confirm-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded"
                        >
                            Change Password
                        </button>
                    </form>
                    <div className="mt-6">
                        <p className="mb-4">
                            If you need help regarding your account, please contact support.
                        </p>
                    </div>
                </div>
            ),
        },
        

        history: {
            title: 'History',
            content: (
                <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w mx-auto">
                    <div className="space-y-4">
                        <p>Coming soon...</p>
                    </div>
                </div>
            ),
        },

        support: {
            title: 'Support',
            content: (
                <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w mx-auto">
                    <div className="space-y-4">
                        <p>If you have any issues or feedback, please fill out the form below, and we will address it as soon as possible.</p>

                        {supportMsg != '' ? <div className="py-4"><strong className="border-l border-gray-700 px-2 py-2 text-center text-sm">{supportMsg}</strong></div> : <></> }

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();

                                const formData = new FormData(e.target);
                                const supportData = {
                                    name: formData.get('name'),
                                    email: formData.get('email'),
                                    issue: formData.get('issue').trim(),
                                    description: formData.get('description').trim(),
                                };

                                // Replace with your database submission logic
                                (sql`INSERT INTO support (email, name, issuetype, description) VALUES (${supportData.email}, ${supportData.email}, ${supportData.issue}, ${supportData.description})`).then(() => {
                                    if (supportData.issue.toLowerCase() == "bug")
                                        setSupportMsg("Thank you for your report!\nOur development team will see to it being fixed.");
                                    else if (supportData.issue.toLowerCase() == "feedback")
                                        setSupportMsg("Thank you for your feedback!\nWe hope you will continue using our service.");
                                    else
                                        setSupportMsg("Your message has been filed.");

                                    issue.value = "";
                                    description.value = "";
                                }).catch((err) => {
                                    setSupportMsg(`An error has occured!\n${JSON.stringify(err)}`);
                                });
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="name">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="w-full p-2 rounded bg-gray-800 text-gray-500 border border-gray-700 focus:outline-none focus:border-blue-500"
                                    value={userData["name"]}
                                    required
                                    readOnly={true}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="w-full p-2 rounded bg-gray-800 text-gray-500 border border-gray-700 focus:outline-none focus:border-blue-500"
                                    value={userData["email"]}
                                    required
                                    readOnly={true}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="issue">
                                    Issue Type
                                </label>
                                <select
                                    id="issue"
                                    name="issue"
                                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select an issue</option>
                                    <option value="Bug">Bug</option>
                                    <option value="Feedback">Feedback</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="description">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="4"
                                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            ),
        },


        verify: {
            title: "Verify Identity",
            show: () => userData["identityverified"] != "verified" && userData["identityverified"] != undefined,
            content: (<>
                {
                    userData["identityverified"] == "in progress" ?
                    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w mx-auto space-y-4">
                        <p className="text-gray-400">Your identity review is in progress!</p>
                    </div>
                    : (userData["role"] === "Student" ? (
                        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w mx-auto space-y-4">
                            <p className="text-gray-400">Upload a picture of your school ID and other relevant document(s):</p>
                            <UploadImageM 
                                label="School ID & Other Documents" 
                                onUpload={(dataUrl) => {
                                    setVerificationImages(dataUrl)
                                }}
                            />
                        </div>
                    ) : (userData["role"] === "Driver" ? (
                        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w mx-auto space-y-4">
                            <p className="text-gray-400">Upload a picture of your driver&apos;s license and other relevant document(s):</p>
                            <UploadImageM 
                                label="Driver's License & Other Documents" 
                                onUpload={(dataUrl) => {
                                    setVerificationImages(prev => [...prev, dataUrl])
                                }}
                            />
                        </div>
                    ) : <></>))
                }
                
                { verificationImages.length > 0
                ? <div className="w-full flex justify-center py-4">
                    <button
                        className="w-50 bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out"
                        type="button"
                        onClick={completeVerification}
                    >
                        Submit Documents for Review
                    </button>
                </div>
                : <></>
                }
                </>
            )
        }
        
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-gray-900 text-white">
          {ensureValidSection()}
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
                key="__home__"
                className="cursor-pointer p-3 rounded-lg transition text-center lg:text-left text-gray-400"
                >
                    <Link href="/home">Home</Link>
                </li>
            {Object.keys(sections).map((sectionKey) => (
                CanShowSection(sections[sectionKey]) ?
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
                : <></>
            ))}
            </ul>

          </div>
      
          {/* Section Content */}
          <div className="flex-1 p-8 overflow-y-hidden">
            <h2 className="text-3xl font-semibold mb-4">{sections[selectedSection].title}</h2>
            <div className="h-full w-full overflow-y-auto pb-8">
                {sections[selectedSection].content}
            </div>
          </div>
        </div>
      );      
}