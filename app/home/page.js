"use client"

import { useEffect } from 'react'
import "./styles.css"
import { EnsureLogin } from '../auth/page';
import Logo from "../assets/images/stuber_logo.png";
import Image from 'next/image';
import NavBar from '../components/navbar';


export default function Home() {
  useEffect(() => {
    EnsureLogin();
  })

  return (
    <div className="container">
      <NavBar />
      
      <div className="find-ride-menu">
        <h1>Get home safely with</h1>
        <Image src={Logo} className="find-ride-menu-logo" alt="Stuber Logo"></Image>
        <p>Find a driver, hop in, and go straight home.</p>
        <input type="text" placeholder="Enter location" className="location-input"></input>
        <input type="text" placeholder="Enter destination" className="destination-input"></input>
        <button className="see-prices-button">See prices</button>
      </div>
    </div>
  )
}