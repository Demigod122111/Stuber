"use client"

import { useEffect, useState } from "react"
import Map, { RouteSelector } from "../components/map"
import NavBar from "../components/navbar"
import { IsVerified } from "../account/page";
import Link from "next/link";
import RideForm from "../components/ride";

export default function Ride()
{
    const [verified, setVerified] = useState(undefined);

    useEffect(() => {
        const GetVerified = async () => {
            setVerified(await IsVerified());
        }

        GetVerified();
    }); // Testing Dynamic

    if (verified == undefined)
    {
        return (<>
            <NavBar />
            <div className="text-white p-6 rounded-lg shadow-lg max-w mx-auto flex justify-center">
                <div className="space-y-4">
                    <p className="text-lg text-blue-400">Searching for verification status...</p>
                </div>
            </div>
        </>);
    }
    else if (verified !== true) 
    {
        return (<>
        <NavBar />
        <div className="text-white p-6 rounded-lg shadow-lg max-w mx-auto flex justify-center">
            <div className="space-y-4">
                <p className="text-lg text-red-400">You need to be verified to access this page!</p>
                <p className="text-base text-blue-400">See <code className="text-blue-700 cursor-pointer">&apos;<Link onClick={() => sessionStorage.setItem("account-section", "verify")} href="/account">Verify Identity</Link>&apos;</code> in your <code className="font-semibold cursor-pointer">&apos;<Link href="/account">Account</Link>&apos;</code> page.</p>
            </div>
        </div>
        </>);
    }

    return (<>
        <NavBar />
        <Map />
        <RideForm />
    </>)
}