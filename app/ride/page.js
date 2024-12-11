"use client";

import { useEffect, useState } from "react";
import Map, { RouteSelector } from "../components/map";
import NavBar from "../components/navbar";
import { IsVerified } from "../account/page";
import Link from "next/link";
import RideForm from "../components/ride";
import DriverRating from "../components/DriverRating";
import { sql } from "../modules/database";

const updateDriverData = async (rating, timesRated, email) => {
  const query = `UPDATE users SET rating = $1 WHERE email = $2`;
  const query2 = `UPDATE users SET timesrated = $1 WHERE email = $2`;

  await sql(query, [rating, email]);
  await sql(query2, [timesRated, email]);
};

const handleRatingSubmit = async (dEmail, ratingChosen) => {
  const data = await sql`SELECT * FROM users WHERE email=${dEmail}`;
  if (data.length > 0) {
    let driverRatingTotal = data[0].rating;
    let driverTimesRated = data[0].timesrated;
    driverRatingTotal += ratingChosen;
    driverTimesRated++;
    updateDriverData(driverRatingTotal, driverTimesRated, dEmail);
  }
};

export default function Ride() {
  const [isRatingOpen, setRatingOpen] = useState(false);

  const [driverEmailAdd, setDriverEmailAdd] = useState("");

  const [verified, setVerified] = useState(undefined);

  useEffect(() => {
    const GetVerified = async () => {
      setVerified(await IsVerified());
    };

    GetVerified();
  }, []);

  if (verified == undefined) {
    return (
      <>
        <NavBar />
        <div className="text-white p-6 rounded-lg shadow-lg max-w mx-auto flex justify-center">
          <div className="space-y-4">
            <p className="text-lg text-blue-400">
              Searching for verification status...
            </p>
          </div>
        </div>
      </>
    );
  } else if (verified !== true) {
    return (
      <>
        <NavBar />
        <div className="text-white p-6 rounded-lg shadow-lg max-w mx-auto flex justify-center">
          <div className="space-y-4">
            <p className="text-lg text-red-400">
              You need to be verified to access this page!
            </p>
            <p className="text-base text-blue-400">
              See{" "}
              <code className="text-blue-700 cursor-pointer">
                &apos;
                <Link
                  onClick={() =>
                    sessionStorage.setItem("account-section", "verify")
                  }
                  href="/account"
                >
                  Verify Identity
                </Link>
                &apos;
              </code>{" "}
              in your{" "}
              <code className="font-semibold cursor-pointer">
                &apos;<Link href="/account">Account</Link>&apos;
              </code>{" "}
              page.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Map />
      <RideForm
        openDriverRating={(driverEmailAddress) => {
          setRatingOpen(true);
          setDriverEmailAdd(driverEmailAddress);
        }}
      />
      {isRatingOpen && (
        <DriverRating
          onSelectClose={() => setRatingOpen(false)}
          onSubmit={(ratingGiven) => {
            handleRatingSubmit(driverEmailAdd, ratingGiven);
          }}
        />
      )}
    </>
  );
}
