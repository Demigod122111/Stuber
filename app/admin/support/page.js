"use client";

import { sql } from "@/app/modules/database";
import { customFormatDateInUTC, GetUserData } from "@/app/modules/misc";
import { useEffect, useState } from "react";
import { EnsureAdmin } from "../page";
import NavBar from "@/app/components/navbar";

export default function Support()
{
    const [userData, setUserData] = useState({});
    const [supports, setSupports] = useState({});

    const RetrieveSupports = () => {
        (sql`SELECT * FROM support ORDER BY created_at ASC`).then((res) => {
            const groupedTickets = res.reduce((acc, ticket) => {
                var issuetype = ["Bug", "Feedback", "Other"].includes(ticket.issuetype) ? ticket.issuetype : "Other";
                if (!acc[issuetype]) acc[issuetype] = [];
                acc[issuetype].push(ticket);
                return acc;
            }, {});
            setSupports(groupedTickets);
        });
    }
    useEffect(() => {
        EnsureAdmin(4);
        GetUserData(setUserData);
    }, []);

    useEffect(() => {
        setInterval(() => {
            RetrieveSupports();
        }, 60000);
    }, []);


    return (
        <>
            <NavBar />
            <div className="p-6 bg-gray-900 text-white min-h-screen">
                {Object.keys(supports).length > 0 ? (
                    Object.keys(supports).map((issuetype) => (
                        <div key={issuetype} className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">
                                {issuetype} ({supports[issuetype].length})
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="table-auto w-full bg-gray-800 border border-gray-700 rounded-lg shadow-md">
                                    <thead>
                                        <tr className="bg-gray-700 text-gray-300">
                                            <th className="px-4 py-2 text-left">Email</th>
                                            <th className="px-4 py-2 text-left">Name</th>
                                            <th className="px-4 py-2 text-left">Description</th>
                                            <th className="px-4 py-2 text-left">Created At</th>
                                            <th className="px-4 py-2 text-left">Done</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {supports[issuetype].map((ticket, index) => (
                                            <tr
                                                key={index}
                                                className="border-t border-gray-700 hover:bg-gray-600"
                                            >
                                                <td className="px-4 py-2 min-w-[fit-content]">{ticket.email}</td>
                                                <td className="px-4 py-2 min-w-[fit-content]">{ticket.name}</td>
                                                <td className="px-4 py-2">{ticket.description}</td>
                                                <td className="px-4 py-2 min-w-[fit-content]">{customFormatDateInUTC(ticket.created_at)}</td>
                                                <td className="px-4 py-2">
                                                    <button
                                                    className="w-full bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 ease-in-out"
                                                    type="button"
                                                    onClick={() => {
                                                        (sql`DELETE FROM support WHERE id=${ticket.id}`).then(() => {
                                                            setSupports((prevSupports) => {
                                                                const updatedSupports = {};
                                                              
                                                                // Iterate through each issuetype key in the dictionary
                                                                for (const [issuetype, tickets] of Object.entries(prevSupports)) {
                                                                  // Filter out the ticket with the matching ID
                                                                  updatedSupports[issuetype] = tickets.filter((support) => support.id !== ticket.id);
                                                                }
                                                              
                                                                return updatedSupports;
                                                            });
                                                        })
                                                    }}
                                                    >
                                                    Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center mt-12">
                        <p className="text-2xl font-semibold text-gray-300">
                            No support tickets available.
                        </p>
                        <p className="text-gray-400 mt-2">
                            All caught up! There are no tickets to display at the moment.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
    
}