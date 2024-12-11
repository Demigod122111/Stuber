"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useState } from "react";
import { Logout } from "../auth/page";
import { GetUserData } from "../modules/misc";
import NavBar from "../components/navbar";
import { sql } from "../modules/database";
import { redirect } from "next/navigation";

export function EnsureAdmin(level)
{
    let userData = {};

    const setUserData = (data) => userData = data;

    GetUserData(setUserData).then(user => {
        if (userData["oppermissionlevel"] < level)
            redirect("/admin");
    })
}

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [totalUsers, setTotalUsers] = useState("N/A"); 
  const [totalDrivers, setTotalDrivers] = useState("N/A"); 
  const [completedRides, setCompletedRides] = useState("N/A"); 
  const [pendingRequests, setPendingRequests] = useState("N/A"); 
  const [topDrivers, setTopDrivers] = useState([]); 

  useEffect(() => {
    setInterval(() => {
      (sql`SELECT count(*) AS total FROM users`).then((res) => setTotalUsers(res[0]["total"]));
      (sql`SELECT count(*) AS total FROM users WHERE role='Driver'`).then((res) => setTotalDrivers(res[0]["total"]));
      (sql`SELECT count(*) AS total FROM rides WHERE status='completed'`).then((res) => setCompletedRides(res[0]["total"]));
      (sql`SELECT count(*) AS total FROM rides WHERE status='waiting'`).then((res) => setPendingRequests(res[0]["total"]));
      (sql`SELECT name, email, rating, timesrated FROM users WHERE role='Driver' ORDER BY CASE WHEN "timesrated" = 0 THEN rating ELSE rating / "timesrated" END DESC LIMIT 3`).then((res) => {
          setTopDrivers(res);
      });
    }, 10000)
  }, [])

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gray-900 text-white transition-all duration-300`}
      >
        <div className="p-4">
          <h1
            className={`text-xl font-bold text-center transition-all duration-300 ${
              sidebarOpen ? "block" : "hidden"
            }`}
          >
            Dashboard
          </h1>
        </div>
        <nav className="mt-10 space-y-2">
          <SidebarLink href="/admin" label="Overview" sidebarOpen={sidebarOpen} />
          <SidebarLink href="/admin/identity-reviews" label="Identity Reviews" sidebarOpen={sidebarOpen} />
          <SidebarLink href="/admin/users" label="Users" sidebarOpen={sidebarOpen} />
          <SidebarLink href="/admin/support" label="Support" sidebarOpen={sidebarOpen} />
        </nav>
        <div className="absolute bottom-0 p-4">
          <button
            className="text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "Collapse" : "Expand"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-x-hidden w-screen bg-gray-800">
        {/* Topbar */}
        <div className="flex justify-between items-center p-4 bg-gray-900 text-white shadow-lg w-full">
          <h2 className="text-xl font-semibold">{sidebarOpen ? "" : "Dashboard"}</h2>
          <div className="flex space-x-4">
            <button className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700" onClick={Logout}>Logout</button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-wrap gap-4 h-screen w-full">
          <StatsCard title="Total Users" value={totalUsers} />
          <StatsCard title="Total Drivers" value={totalDrivers} />
          <StatsCard title="Completed Rides" value={completedRides} />
          <StatsCard title="Pending Requests" value={pendingRequests} />

          {/* Additional Sections */}
          <RecentActivities />
          <TopDrivers topDrivers={topDrivers}/>
        </div>
      </div>
    </div>
  );
};

const SidebarLink = ({ href, label, sidebarOpen }) => (
  <Link href={href} className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition duration-300">
      {sidebarOpen ? label : label[0]}
  </Link>
);

const StatsCard = ({ title, value }) => (
  <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-64 overflow-x-auto">
    <h3 className="text-gray-500 font-semibold text-lg">{title}</h3>
    <p className="text-2xl font-bold text-gray-300 mt-2">{value}</p>
  </div>
);

const RecentActivities = () => (
  <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-full overflow-x-auto">
    <h3 className="text-lg font-semibold text-gray-700">Recent Activities</h3>
    <ul className="mt-4 space-y-2">
        {/*
      <li className="text-gray-600">John Doe completed a ride.</li>
      <li className="text-gray-600">New driver registration request from Jane Smith.</li>
      <li className="text-gray-600">Ride request #1234 is pending approval.</li>
      */}
    </ul>
  </div>
);

function TopDrivers({topDrivers}) 
{
    return <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-full overflow-x-auto">
        <h3 className="text-lg font-semibold text-gray-700">Top Drivers</h3>
        <div className="mt-4 space-y-2">
        {
            topDrivers.map((driver) =>
                <div className="flex justify-between" key={driver["email"]}>
                    <p className="text-gray-500">{driver["name"]} ({driver["email"]})</p>
                    <div className="flex justify-evenly gap-4">
                        <p className="text-gray-300 font-bold">{Number(driver["timesrated"]) == 0 ? driver["rating"].toFixed(1) : (Number(driver["rating"]) / Number(driver["timesrated"])).toFixed(1)}/5.0</p>
                        <p className="text-gray-300 font-semibold">[{driver["timesrated"]}]</p>
                    </div>
                </div>
            )
        }
        </div>
    </div>
}

export default function Admin()
{
    const [userData, setUserData] = useState({});

    useEffect(() => {
        GetUserData(setUserData);
    }, []);

    if (userData["oppermissionlevel"] == undefined)
    {
        return (<>
          <NavBar />
          <div className="text-white p-6 rounded-lg shadow-lg max-w mx-auto flex justify-center">
              <div className="space-y-4">
                  <p className="text-lg text-blue-400">Searching for permission level...</p>
              </div>
          </div>
        </>);
    }

    if (Number(userData["oppermissionlevel"]) < 4) 
    {
        return (<>
        <NavBar />
        <div className="text-white p-6 rounded-lg shadow-lg max-w mx-auto flex justify-center">
            <div className="space-y-4">
                <p className="text-lg text-red-400">You don&apos;t have enough permissions to access this page!</p>
                <p className="text-base text-blue-400">Current Permission Level: {userData["oppermissionlevel"]}</p>
            </div>
        </div>
        </>);
    }

    return (<>
        <NavBar />
        <AdminDashboard />
    </>);
}
