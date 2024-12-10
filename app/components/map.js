"use client"
import { Loader } from '@googlemaps/js-api-loader';
import React, { useEffect, useRef, useState } from 'react';

export default function Map() 
{
    const mapRef = useRef(null);

    useEffect(() => {
        const initMap = async () => {
            const loader = new Loader({
                apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
                version: 'weekly'
            });

            const { Map } = await loader.importLibrary('maps');
            const { Marker } = await loader.importLibrary('marker');

            let position = {
                lat: 181096,
                lng: -772975
            }
            
            const mapOptions = {
                center: { lat: 18.1096, lng: -77.2975 }, // Central coordinates of Jamaica
                zoom: 7,
                mapId: "STUBER_RIDE",
                mapTypeId: "satellite", // Set the map type to satellite view
                disableDefaultUI: true, // Disable all default UI controls
                restriction: {
                    latLngBounds: {
                        north: 19,
                        south: 17,
                        east: -75.5,
                        west: -79.5,
                    }, // Latitude and longitude bounds for Jamaica
                    strictBounds: true, // Prevent users from panning outside the bounds
                },
            };

            const map = new Map(mapRef.current, mapOptions);

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (location) => {
                        position = {
                            lat: location.coords.latitude,
                            lng: location.coords.longitude,
                        };
                        
                        const marker = new Marker({
                            map,
                            position
                        })
                    },
                    (error) => {
                        console.error("Error getting user location:", error);
                    }
                );
            } else {
                console.error("Geolocation is not supported by this browser.");
            }
        }

        initMap();
    }, []);

    return (<>
        <div className="w-screen flex justify-center py-12">
            <div
                className="w-full max-w-4xl h-96 border border-gray-500 flex items-center justify-center px-4"
                ref={mapRef}             
            >
                <p className="text-center">Loading Map</p>
            </div>

            
        </div>
        
    </>)
}