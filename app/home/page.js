"use client"

import React, { useState } from 'react'
import "./styles.css"

export default function Home() {
  return (
    <div className="container">
      <link rel="icon" type="image/x-icon" href="/icon.png"></link>
      <nav>
        <a href="/home" className="nav-bar-logo-link"><img src="/logo.png" className="nav-bar-logo"></img></a>
      </nav>
      <div className="find-ride-menu">
        <h1>Get home safely with</h1>
        <img src="/logo.png" className="find-ride-menu-logo" alt="logo"></img>
        <p>Find a driver, hop in, and go straight home.</p>
        <input type="text" placeholder="Enter location" className="location-input"></input>
        <input type="text" placeholder="Enter destination" className="destination-input"></input>
        <button className="see-prices-button">See prices</button>
      </div>
    </div>
  )
}