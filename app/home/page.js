"use client"

import React, { useState } from 'react'
import "./styles.css"

export default function Home() {
  return (
    <div>
      <div className="find-ride-menu">
        <h1>Go anywhere with Stuber</h1>
        <input type="text" placeholder="Enter location" className="location-input"></input>
        <input type="text" placeholder="Enter destination" className="destination-input"></input>
      </div>
    </div>
  )
}