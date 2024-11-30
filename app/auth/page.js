"use client"

import React, { useState } from 'react';
import { sql } from '../modules/database.js';
import { encryptPassword } from '../modules/security.js';

const CreateAccount = async (name, email, password, phonenumber) => {
    const res = await sql`INSERT INTO users (name, email, password, phonenumber) VALUES (${name}, ${email}, ${password}, ${phonenumber})`;
    
};

export default function Auth()
{
    const [isLogin, setIsLogin] = useState(true);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [password, setPassword] = useState('');

    return (<>
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
              <form onSubmit={(e) => {
                e.preventDefault();
                CreateAccount(name, email, encryptPassword(password), phonenumber);
              }} >
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-bold mb-2">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-700 text-gray-200"
                    placeholder=""
                    value={name}
                    onChange={({target}) => setName(target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-bold mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-700 text-gray-200"
                    placeholder=""
                    value={email}
                    onChange={({target}) => setEmail(target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-bold mb-2">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-700 text-gray-200"
                    placeholder=""
                    value={phonenumber}
                    onChange={({target}) => setPhonenumber(target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-bold mb-2">Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-700 text-gray-200"
                    placeholder="Password: "
                    value={password}
                    onChange={({target}) => setPassword(target.value)}
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
        </>);
}