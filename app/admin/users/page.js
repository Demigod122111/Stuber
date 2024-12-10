"use client";

import NavBar from "@/app/components/navbar";
import { sql } from "@/app/modules/database";
import { useEffect, useState } from "react";
import { EnsureAdmin } from "../page";
import { customFormatDate, customFormatDateInUTC, GetUserData, UpdateGlobalUserData } from "@/app/modules/misc";


export default function Users() {
    const [userData, setUserData] = useState({});
    const [users, setUsers] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    const RetrieveUsers = () => {
        (sql`SELECT * FROM users ORDER BY created_at ASC`).then((res) => setUsers(res));
    }
    useEffect(() => {
        EnsureAdmin(4);
        GetUserData(setUserData);
    }, []);

    useEffect(() => {
        RetrieveUsers();
    }); // Testing Dynamic

    const sortUsers = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") 
        {
            direction = "desc";
        }

        setSortConfig({ key, direction });

        const sortedUsers = [...users].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === "asc" ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === "asc" ? 1 : -1;
            }
            return 0;
        });

        setUsers(sortedUsers);
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === "asc" ? "↑" : "↓";
    };

    return (
        <>
            <NavBar />
            <div className="p-4 bg-gray-900 min-h-screen text-white">
                <h1 className="text-2xl font-bold mb-4">All Users</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                        <thead>
                            <tr className="bg-gray-700 text-gray-300">
                                <th
                                    className="px-6 py-3 text-left text-sm font-medium cursor-pointer"
                                    onClick={() => sortUsers("name")}
                                >
                                    Name {getSortIcon("name")}
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-sm font-medium cursor-pointer"
                                    onClick={() => sortUsers("email")}
                                >
                                    Email {getSortIcon("email")}
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-sm font-medium cursor-pointer"
                                    onClick={() => sortUsers("role")}
                                >
                                    Role {getSortIcon("role")}
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-sm font-medium cursor-pointer"
                                    onClick={() => sortUsers("phonenumber")}
                                >
                                    Phone Number {getSortIcon("phonenumber")}
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-sm font-medium cursor-pointer"
                                    onClick={() => sortUsers("identityverified")}
                                >
                                    Identity Status {getSortIcon("identityverified")}
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-sm font-medium cursor-pointer"
                                    onClick={() => sortUsers("oppermissionlevel")}
                                >
                                    OP Level {getSortIcon("oppermissionlevel")}
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-sm font-medium cursor-pointer"
                                    onClick={() => sortUsers("created_at")}
                                >
                                    Created Timestamp {getSortIcon("created_at")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map((user, index) => (
                                    <tr
                                        key={user.email}
                                        className={`${
                                            index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                                        } hover:bg-gray-600`}
                                    >
                                        <td className="px-6 py-4 text-sm">{user.name}</td>
                                        <td className="px-6 py-4 text-sm">{user.email}</td>
                                        <td className="px-6 py-4 text-sm">{user.role}</td>
                                        <td className="px-6 py-4 text-sm">{user.phonenumber}</td>
                                        <td className="px-6 py-4 text-sm">{user.identityverified}</td>
                                        <td className="px-6 py-4 text-sm">
                                            {
                                            userData["email"] != user.email ?
                                            <input type="number" min="0" max="4" defaultValue={user.oppermissionlevel} onInputCapture={({target}) => {
                                                if (target.value == "") target.value = 0;
                                                if (!(target.value >= 0 && target.value <= 4)) return;
                                                users[index]["oppermissionlevel"] = target.value;
                                                UpdateGlobalUserData(user.email, "oppermissionlevel", target.value).then(RetrieveUsers);
                                            }} 
                                            className="w-full bg-transparent"
                                            />
                                            : <>{user.oppermissionlevel}</>
                                            }
                                        </td>
                                        <td className="px-6 py-4 text-sm">{customFormatDateInUTC(new Date(user.created_at))}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-6 py-4 text-center text-sm text-gray-400"
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
