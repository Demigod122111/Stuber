"use client"

import React, { useState } from 'react';

export default function Auth()
{
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="bg-gray-800 shadow-lg rounded-lg w-full max-w-md p-6">
            <div className="flex justify-around border-b border-gray-700 mb-6">
              <button
                className={`w-1/2 text-center py-2 ${
                  isLogin ? 'border-b-2 border-green-500 text-green-500' : 'text-gray-400'
                }`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button
                className={`w-1/2 text-center py-2 ${
                  !isLogin ? 'border-b-2 border-yellow-500 text-yellow-500' : 'text-gray-400'
                }`}
                onClick={() => setIsLogin(false)}
              >
                Register
              </button>
            </div>
    
            {isLogin ? (
              <form>
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-bold mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-gray-200"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-bold mb-2">Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-gray-200"
                    placeholder="Enter your password"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-500 text-black py-2 rounded-md hover:bg-green-600 focus:outline-none"
                >
                  Login
                </button>
              </form>
            ) : (
              <form>
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-bold mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-700 text-gray-200"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-bold mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-700 text-gray-200"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-bold mb-2">Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-700 text-gray-200"
                    placeholder="Enter your password"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-yellow-500 text-black py-2 rounded-md hover:bg-yellow-600 focus:outline-none"
                >
                  Register
                </button>
              </form>
            )}
          </div>
        </div>
    );
}