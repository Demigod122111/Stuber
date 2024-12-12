import { useEffect, useState } from 'react';
import { GetUserData } from '../modules/misc';
import { sql } from '../modules/database';

const parishOptions = [
    "Kingston",
    "St. Andrew",
    "St. Catherine",
    "Clarendon",
    "Manchester",
    "St. Elizabeth",
    "Westmoreland",
    "Hanover",
    "St. James",
    "Trelawny",
    "St. Ann",
    "St. Mary",
    "Portland",
    "St. Thomas",
];

export default function RideForm( {openDriverRating} ) {
    const [pickup, setPickup] = useState({ street: '', parish: '' });
    const [dropoff, setDropoff] = useState({ street: '', parish: '' });
    const [routeSpecification, setRouteSpecification] = useState('');

    const [currentRide, setCurrentRide] = useState({});

    const [rides, setRides] = useState([]);

    const [userData, setUserData] = useState({});
    const [role, setRole] = useState('');

    const [canCreateRequest, setCanCreateRequest] = useState(true);

    const [updates, setUpdates] = useState({})

    const changeUpdate = (key, value, immediate) => {
        setTimeout(() => {
            setUpdates(prev => setUpdates({ ...prev, [key]: value }));
        }, immediate ? 0 : 5000);
    }
    const canUpdate = (key) => {
        if (updates == undefined || updates == null) setUpdates({});

        return updates == undefined || updates == null || updates[key] == undefined || updates[key] == null || updates[key];
    }
    
    const getCurrentRide = (id, then) => {
        if (id == -1) return;
        sql`SELECT r.*, u.name, d.name AS dname, d.phonenumber AS dphonenumber FROM rides r JOIN users u ON r.studentemail = u.email LEFT JOIN users d ON r.driveremail = d.email AND r.driveremail IS NOT NULL AND r.driveremail <> '' WHERE r.id=${id}`.then((res) => {
            setCurrentRide(res[0]);
            setCanCreateRequest(true);

            if (then) then();
        });
    }

    useEffect(() => {
        GetUserData(setUserData, { "role": setRole });
    }, [userData]);

    useEffect(() => {
        GetUserData(setUserData, { "role": setRole }).then((user) => {            
            setInterval(() => {
                if (canUpdate("requests"))
                {
                    changeUpdate("requests", false, true);
                    sql`SELECT r.*, u.name FROM rides r JOIN users u ON r.studentemail = u.email WHERE r.status=${"waiting"}`.then(res => {
                        setRides(res);
                        changeUpdate("requests", true, false);
                    });
                }
    
                if (canUpdate("currentride"))
                {
                    sql`SELECT currentride FROM users WHERE id=${user.id}`.then(res => {
                        if (res[0]["currentride"] != -1)
                        {
                            getCurrentRide(res[0]["currentride"], () => { changeUpdate("currentride", true, false); });
                        }
                        else setCurrentRide({});

                        changeUpdate("currentride", false, true);
                    })
                }
            }, 5000)
        })
    }, []);

    const cancelRide = () => {
        sql`UPDATE rides SET status=${"cancelled"} WHERE id=${currentRide["id"]}`
        sql`UPDATE users SET currentride=${-1} WHERE email=${userData["email"]}`
        setUserData({ ...userData, "currentride": -1 });
    }

    const resetForm = () => {
        setPickup({ street: '', parish: '' });
        setDropoff({ street: '', parish: '' });
        setRouteSpecification('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canCreateRequest || (userData["currentride"] && userData["currentride"] != -1)) return;
        setCanCreateRequest(false);
        const res = await sql`INSERT INTO rides (studentemail, pickupstreet, pickupparish, dropoffstreet, dropoffparish, routespecs) VALUES (${userData["email"]}, ${pickup.street}, ${pickup.parish}, ${dropoff.street}, ${dropoff.parish}, ${routeSpecification}) RETURNING *`;
        setCurrentRide(res[0]);
        const id = res[0]["id"];
        sql`UPDATE users SET currentride=${id} WHERE email=${userData["email"]}`
        setUserData({ ...userData, "currentride": id });
        getCurrentRide(id);

        resetForm();
    };

    if (role == '')
    {
        return (<>
            <div className="text-white p-6 rounded-lg shadow-lg max-w mx-auto flex justify-center">
                <div className="space-y-4">
                    <p className="text-lg text-blue-400">Searching for role...</p>
                </div>
            </div>
        </>);
    }
    else if (role == 'Student')
    {
        if (!userData["currentride"] || userData["currentride"] == -1)
        {
            return (
                <div className="flex justify-center items-center min-w-screen px-4">
                    <form
                        className="w-full max-w-4xl  p-6 rounded-lg shadow-md"
                        onSubmit={handleSubmit}
                    >
                        <h2 className="text-xl font-semibold mb-6 text-gray-700">Book Your Ride</h2>

                        {/* Pickup Location */}
                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-400 mb-2">Pickup Location</h3>
                            <div className="flex flex-col md:flex-row gap-4">
                                <input
                                    type="text"
                                    placeholder="Street"
                                    className="w-full md:w-2/3 border border-gray-300 text-white bg-transparent rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value={pickup.street}
                                    onChange={(e) => setPickup({ ...pickup, street: e.target.value })}
                                    required
                                />
                                <select
                                    className="w-full md:w-1/3 border border-gray-300 text-white bg-transparent focus:bg-gray-900 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value={pickup.parish}
                                    onChange={(e) => setPickup({ ...pickup, parish: e.target.value })}
                                    required
                                >
                                    <option value="">
                                        Select Parish
                                    </option>
                                    {parishOptions.map((parish) => (
                                        <option key={parish} value={parish}>
                                            {parish}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Dropoff Location */}
                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-400 mb-2">Dropoff Location</h3>
                            <div className="flex flex-col md:flex-row gap-4">
                                <input
                                    type="text"
                                    placeholder="Street"
                                    className="w-full md:w-2/3 border border-gray-300 text-white bg-transparent rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value={dropoff.street}
                                    onChange={(e) => setDropoff({ ...dropoff, street: e.target.value })}
                                    required
                                />
                                <select
                                    className="w-full md:w-1/3 border border-gray-300 text-white bg-transparent focus:bg-gray-900 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value={dropoff.parish}
                                    onChange={(e) => setDropoff({ ...dropoff, parish: e.target.value })}
                                    required
                                >
                                    <option value="">
                                        Select Parish
                                    </option>
                                    {parishOptions.map((parish) => (
                                        <option key={parish} value={parish}>
                                            {parish}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Route Specification */}
                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-400 mb-2">Route Specification (Optional)</h3>
                            <textarea
                                placeholder="Enter route details if necessary"
                                className="w-full border border-gray-300 rounded-md p-2 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                                rows="3"
                                value={routeSpecification}
                                onChange={(e) => setRouteSpecification(e.target.value)}
                            ></textarea>
                        </div>

                        {/* Submit Button */}
                        <div className="text-right">
                            <button
                                type="reset"
                                className="bg-transparent text-white px-6 py-2 rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 mr-4"
                                onClick={resetForm}
                            >
                                Reset
                            </button>
                            
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            );
        }
        else
        {
            if (!currentRide)
            {
                return (<>
                    <div className="text-white p-6 rounded-lg shadow-lg max-w mx-auto flex justify-center">
                        <div className="space-y-4">
                            <p className="text-lg text-blue-400">Searching for your ride...</p>
                        </div>
                    </div>
                </>);
            }

            return <div className="flex justify-center items-center min-w-screen px-4">
                <form
                    className="w-full max-w-4xl  p-6 rounded-lg shadow-md"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <h2 className="text-xl font-semibold mb-6 text-gray-700">Your Ride</h2>

                    {/* Pickup Location */}
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-400 mb-2">Pickup Location</h3>
                        <div className="flex flex-col md:flex-row gap-4">
                            <input
                                type="text"
                                placeholder="Street"
                                className="w-full md:w-2/3 border border-gray-300 text-white bg-transparent rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={currentRide["pickupstreet"]}
                                required
                                readOnly
                            />
                            <select
                                className="w-full md:w-1/3 border border-gray-300 text-white bg-transparent focus:bg-gray-900 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={currentRide["pickupparish"]}
                                required
                                readOnly
                            >
                                <option value="">
                                    Select Parish
                                </option>
                                {parishOptions.map((parish) => (
                                    <option key={parish} value={parish}>
                                        {parish}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Dropoff Location */}
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-400 mb-2">Dropoff Location</h3>
                        <div className="flex flex-col md:flex-row gap-4">
                            <input
                                type="text"
                                placeholder="Street"
                                className="w-full md:w-2/3 border border-gray-300 text-white bg-transparent rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={currentRide["dropoffstreet"]}
                                required
                                readOnly
                            />
                            <select
                                className="w-full md:w-1/3 border border-gray-300 text-white bg-transparent focus:bg-gray-900 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={currentRide["dropoffparish"]}
                                required
                                readOnly
                            >
                                <option value="">
                                    Select Parish
                                </option>
                                {parishOptions.map((parish) => (
                                    <option key={parish} value={parish}>
                                        {parish}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Route Specification */}
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-400 mb-2">Route Specification</h3>
                        <textarea
                            className="w-full border border-gray-300 rounded-md p-2 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                            rows="3"
                            value={!currentRide["routespecs"] || currentRide["routespecs"] == '' ? "None" : currentRide["routespecs"]}
                            readOnly
                        ></textarea>
                    </div>

                    {/* Driver Details */}
                    { currentRide.driveremail && currentRide.driveremail != ''
                        ? <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-400 mb-2">Driver Details</h3>
                            <p className="text-gray-500">Name: <span className='text-yellow-500'>{currentRide["dname"]}</span></p>
                            <p className="text-gray-500">Phone Number <span className='text-yellow-500'>{currentRide["dphonenumber"]}</span></p>
                            <p className="text-gray-500">Email: <span className='text-yellow-500'>{currentRide["driveremail"]}</span></p>
                        </div>
                        : <></>
                    }

                    {/* Submit Button */}
                    <div className="text-right">
                        {
                            !currentRide.driveremail || currentRide.driveremail == ''
                            ? <button
                                type="button"
                                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                onClick={cancelRide}
                            >
                                Cancel
                            </button>
                            : <button
                                type="button"
                                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                onClick={() => {
                                    sql`UPDATE rides SET status=${"completed"} WHERE id=${currentRide.id}`;
                                    openDriverRating(currentRide.driveremail);                      
                                    sql`UPDATE users SET currentride=${-1} WHERE email=${userData["email"]} OR email=${currentRide.driveremail}`.then(() => setUserData({ ...userData, "currentride": -1 }));
                                }}
                            >
                                Mark as Completed
                            </button>
                        }
                    </div>
                </form>
            </div>
        }
    }
    else if (role == 'Driver')
    {
        if (!userData["currentride"] || userData["currentride"] == -1)
        {
            if (rides.length == 0)
            {
                return (
                <div className="border-t border-gray-700 shadow-md rounded-lg px-4 py-2 flex flex-col gap-4">
                <h2 className="text-lg font-semibold w-full overflow-auto text-blue-500 text-center border-l border-r border-b border-gray-700">No Ride Requests</h2>
                </div>);
            }

            return (<>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 w-full">
                {rides.map((ride) => 
                    <div className="border-t border-b border-gray-700 shadow-md rounded-lg px-4 py-2 flex flex-col gap-4" key={ride.id}>
                        <h2 className="text-lg font-semibold w-full overflow-auto text-white text-center border-l border-r border-b border-gray-700">{ride.name}</h2>
                        <p className="text-gray-600 w-full overflow-auto">
                            {ride.studentemail}
                        </p>

                        <div className='w-full overflow-auto my-4'>                        
                            <h3 className="text-base font-semibold">Pickup</h3>
                            <p className="text-gray-600">
                            Street: <span className="font-medium text-yellow-500">{ride.pickupstreet}</span>
                            </p>
                            <p className="text-gray-600">
                            Parish: <span className="font-medium text-yellow-500">{ride.pickupparish}</span>
                            </p>

                            <h3 className="text-base font-semibold">Drop Off</h3>
                            <p className="text-gray-600">
                            Street: <span className="font-medium text-yellow-500">{ride.dropoffstreet}</span>
                            </p>
                            <p className="text-gray-600">
                            Parish: <span className="font-medium text-yellow-500">{ride.dropoffparish}</span>
                            </p>

                            <p className="text-gray-600">
                            Route Specification: 
                                <textarea
                                    className="w-full rounded-md p-2 bg-transparent text-yellow-500 outline-none focus:ring-2 focus:ring-blue-400 font-medium"
                                    rows="3"
                                    value={ride.routespecs == '' ? "None" : ride.routespecs}
                                    readOnly
                                ></textarea>
                            </p>
                        </div>
                        <button className="mt-auto px-4 py-2 border-t border-l border-r border-gray-700 text-white hover:rounded hover:bg-blue-600 transition" onClick={() => {
                            sql`UPDATE rides SET driveremail=${userData["email"]} WHERE id=${ride.id}`;
                            sql`UPDATE rides SET status=${"in progress"} WHERE id=${ride.id}`;
                            sql`UPDATE users SET currentride=${ride.id} WHERE email=${userData["email"]}`.then(() => setUserData({ ...userData, "currentride": ride.id }));
                            setCurrentRide(ride);
                        }}>
                            Accept Ride Request
                        </button>
                    </div>
                )}
                </div>
            </>);
        }
        else
        {
            if (!currentRide)
            {
                return (<>
                    <div className="text-white p-6 rounded-lg shadow-lg max-w mx-auto flex justify-center">
                        <div className="space-y-4">
                            <p className="text-lg text-blue-400">Searching for your ride...</p>
                        </div>
                    </div>
                </>);
            }

            return <div className="w-full flex justify-center">
                <div className="border-t border-b border-gray-700 shadow-md rounded-lg px-4 py-2 flex flex-col gap-4">
                    <h2 className="text-lg font-semibold w-full overflow-auto text-blue-500 text-center border-l border-r border-b border-gray-700">{currentRide.name}</h2>
                    <p className="text-gray-600 w-full overflow-auto">
                        {currentRide.studentemail}
                    </p>

                    <div className='w-full overflow-auto my-4'>                        
                        <h3 className="text-base font-semibold">Pickup</h3>
                        <p className="text-gray-600">
                        Street: <span className="font-medium text-yellow-500">{currentRide.pickupstreet}</span>
                        </p>
                        <p className="text-gray-600">
                        Parish: <span className="font-medium text-yellow-500">{currentRide.pickupparish}</span>
                        </p>

                        <h3 className="text-base font-semibold">Drop Off</h3>
                        <p className="text-gray-600">
                        Street: <span className="font-medium text-yellow-500">{currentRide.dropoffstreet}</span>
                        </p>
                        <p className="text-gray-600">
                        Parish: <span className="font-medium text-yellow-500">{currentRide.dropoffparish}</span>
                        </p>

                        <p className="text-gray-600">
                        Route Specification: 
                            <textarea
                                className="w-full rounded-md p-2 bg-transparent text-yellow-500 outline-none focus:ring-2 focus:ring-blue-400 font-medium"
                                rows="3"
                                value={currentRide.routespecs == '' ? "None" : currentRide.routespecs}
                                readOnly
                            ></textarea>
                        </p>
                    </div>
                    <button className="mt-auto px-4 py-2 border-t border-l border-r border-gray-700 text-white hover:rounded hover:bg-blue-600 transition" onClick={() => {
                        sql`UPDATE rides SET status=${"completed"} WHERE id=${currentRide.id}`;                        
                        sql`UPDATE users SET currentride=${-1} WHERE email=${userData["email"]}`.then(() => setUserData({ ...userData, "currentride": -1 }));
                        setRides(prev => prev.filter(ride => ride.id != currentRide.id));
                    }}>
                        Mark as Completed
                    </button>
                </div>
            </div>
        }
    }
    else 
    return (<>
        <div className="text-white p-6 rounded-lg shadow-lg max-w mx-auto flex justify-center">
            <div className="space-y-4">
                <p className="text-lg text-blue-400">Unknown Role</p>
            </div>
        </div>
    </>);
}
