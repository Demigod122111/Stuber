"use client"

import { useEffect } from 'react'
import "./styles.css"
import { EnsureLogin } from '../auth/page';
import Logo from "../assets/images/stuber_logo.png";


export default function Home() {
  useEffect(() => {
    EnsureLogin();
  })

  return (
    <div className="container">
      <nav>
        <a href="/home" className="nav-bar-logo-link"><img src={Logo} className="nav-bar-logo"></img></a>
      </nav>
      <div className="find-ride-menu">
        <h1>Get home safely with</h1>
        <img src={Logo} className="find-ride-menu-logo" alt="logo"></img>
        <p>Find a driver, hop in, and go straight home.</p>
        <input type="text" placeholder="Enter location" className="location-input"></input>
        <input type="text" placeholder="Enter destination" className="destination-input"></input>
        <button className="see-prices-button">See prices</button>
      </div>
    </div>
  )
}