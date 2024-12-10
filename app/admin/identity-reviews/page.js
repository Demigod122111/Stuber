"use client";
import NavBar from "@/app/components/navbar";
import { sql } from "@/app/modules/database";
import { useEffect, useState } from "react";
import { EnsureAdmin } from "../page";
import Image from "next/image";

export function FullScreenImageViewer({ imageUrl, onClose }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
            {/* Close Button */}
            <button
                className="absolute top-4 right-4 text-white text-2xl font-bold focus:outline-none hover:text-gray-300 transition"
                onClick={onClose}
                aria-label="Close"
            >
                &times;
            </button>

            {/* Image */}
            <div className="max-w-screen max-h-screen flex justify-center items-center p-16"> {/* Increased padding */}
                <div className="m-8"> {/* Added margin around the image */}
                    <Image
                        src={imageUrl}
                        alt="Full screen view"
                        width={16}
                        height={16}
                        className="max-h-full max-w-full min-h-[75%] w-auto rounded-lg shadow-lg"
                    />
                </div>
            </div>
        </div>
    );
}


export default function IReviews()
{
    const [awaitingReview, setAwaitingReview] = useState([]); 
    const [viewing, setViewing] = useState("");

    useEffect(() => {
        EnsureAdmin(4);
        (sql`SELECT * FROM users WHERE identityverified='in progress'`).then((res) => setAwaitingReview(res));
    }) // Testing Dynamic

    const handleApproval = (email) => {
        sql`UPDATE users SET identityverified='verified' WHERE email=${email}`
            .then(() => {
                setAwaitingReview(awaitingReview.filter((user) => user.email !== email));
            })
            .catch((err) => console.error("Error approving user:", err));
    };

    const handleRejection = (email) => {
        sql`UPDATE users SET identityverified='rejected' WHERE email=${email}`
            .then(() => {
                setAwaitingReview(awaitingReview.filter((user) => user.email !== email));
            })
            .catch((err) => console.error("Error rejecting user:", err));
    };

    return (
        <>
            <NavBar />

            <div className="mx-auto p-4">
                {awaitingReview.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg">No users awaiting review.</p>
                ) : (
                    awaitingReview.map((user) => (
                        <div
                            key={user.email}
                            className="bg-gray-800 p-4 mb-4 rounded-lg shadow-md"
                        >
                            <h2 className="text-xl font-bold text-white mb-2">
                                {user.name} ({user.email})
                            </h2>
                            <p className="text-gray-400 mb-4 text-base">Role: {user.role}</p>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => handleApproval(user.email)}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200 text-sm"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleRejection(user.email)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200 text-sm"
                                >
                                    Reject
                                </button>
                            </div>

                            <div className="flex gap-4 overflow-auto mt-4">
                                {
                                    Object.values(JSON.parse(user.identitydocuments.replace("[[", "[").replace("]]", "]"))).map((doc, index) => 
                                    <img
                                        key={index}
                                        src={doc}
                                        alt={`$Identity Document ${index + 1}`}
                                        className="h-full w-auto rounded-lg shadow-md"
                                        style={{height: "200px"}}
                                        onClick={() => setViewing(doc)}
                                    />)
                                }
                            </div>
                        </div>
                    ))
                )}
            </div>

            {viewing != "" && (
                <FullScreenImageViewer
                    imageUrl={viewing}
                    onClose={() => setViewing("")}
                />
            )}
        </>
    );
}