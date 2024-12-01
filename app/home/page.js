"use client"

import { useEffect } from 'react'

import "./styles.css"
import { EnsureLogin } from '../auth/page';


export default function Home() {
  useEffect(() => {
    EnsureLogin();
  })

  return (
    <div className="container">
      <link rel="icon" type="image/x-icon" href="/icon.png"></link>
      <nav>
        <img src="/icon.png" className="icon"></img>
      </nav>
      <div className="find-ride-menu">
        <h1>Get home safely with</h1>
        <img src="/logo.png" className="logo" alt="logo"></img>
        <p>Find a driver, hop in, and go straight home.</p>
        <input type="text" placeholder="Enter location" className="location-input"></input>
        <input type="text" placeholder="Enter destination" className="destination-input"></input>
        <button className="see-prices-button">See prices</button>
      </div>
    </div>
  )
}