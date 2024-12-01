"use client"

import React, { useEffect, useState } from 'react';
import { sql } from '../modules/database.js';
import { encryptPassword, decryptPassword, uuidv4 } from '../modules/security.js';
import Image from 'next/image.js';
import logo from '../assets/images/stuber_logo.png';
import { redirect } from 'next/navigation.js';
import ResetPwd from '../modules/reset-password.js';

export const IsLoggedIn = async () => {
    const cuser = sessionStorage.getItem("cuser");
    const csession = sessionStorage.getItem("csession");

    const res = await sql`SELECT name FROM users WHERE id=${cuser} AND currentsession=${csession}`;

    if (res.length == 0)
        return false;
    return true;
}

export const EnsureLogin = async () => {
  if (!(await IsLoggedIn()))
    redirect("/auth");
}

export const GetCurrentUser = () => sessionStorage.getItem("cuser");

const CreateAccount = async (name, email, password, phonenumber, uid, setMsg, setIsLogin) => {
    const res = await sql`SELECT name FROM users WHERE email=${email}`;

    if (res.length == 0)
    {
        await sql`INSERT INTO users (name, email, password, phonenumber, uid) VALUES (${name}, ${email}, ${password}, ${phonenumber}, ${uid})`;
        setMsg("User Created!");
        setIsLogin(true);
    }
    else setMsg("User already exists!");
};

const Login = async (email, password, resetPwdMode, setMsg) => {
    const res = await sql`SELECT password, uid, id FROM users WHERE email=${email}`;
    
    if (res.length > 0)
    {
        if (resetPwdMode)
        {
            const npwd = await encryptPassword(res[0]["uid"], password);
            await sql`UPDATE users SET password=${npwd} WHERE uid=${res[0]["uid"]} AND id=${res[0]["id"]}`;
        }

        const pwd = resetPwdMode ? password : await decryptPassword(res[0]["uid"], res[0]["password"]);

        if (password == pwd)
        {
            setMsg("Logging In...");
            const sessionUID = uuidv4();
            await sql`UPDATE users SET currentsession=${sessionUID} WHERE id=${res[0]["id"]} AND uid=${res[0]["uid"]}`;
            sessionStorage.setItem("cuser", res[0]["id"]);
            sessionStorage.setItem("csession", sessionUID);
            redirect("/home");
        }
        else setMsg("Incorrect Password!");
    }
    else setMsg("User doesn't exists!");
}

export default function Auth()
{
    const [isLogin, setIsLogin] = useState(true);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [resetPwdMode, setResetPwdMode] = useState(false);
    const [resetCode, setResetCode] = useState('');
    const [expectedResetCode, setExpectedResetCode] = useState();

    useEffect(() => {
        if (msg != '')
        {
            setTimeout(() => {
                setMsg('');
            }, 5000);
        }
    }, [msg]);

    const CreateResetCode = async () => {
        const code = await ResetPwd(email);

        if (code == false)
        {
            setMsg(`Unable to send reset code to ${email}`);
        }
        else 
        {
            setMsg(`Reset code sent to ${email}`);
            setExpectedResetCode(code);
        }
    }

    return (<>
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="bg-gray-800 shadow-lg rounded-lg w-full max-w-md p-6">
          <Image src={logo} width={300} height={262} className="h-auto w-full" alt="Stuber Logo"></Image>
            {msg != '' ? <strong className="border-l border-blue-700 px-2 text-sm">{msg}</strong> : <></> }
            <div className="flex justify-around border-b border-gray-700 mb-6">
              <button
                className={`w-1/2 text-center py-2 ${
                  isLogin ? 'border-b-2 border-green-500 text-green-500' : 'text-gray-400'
                }`}
                onClick={() => {
                    setIsLogin(true);
                    setResetPwdMode(false);
                    setResetCode(''); 
                }}
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
              <form onSubmit={(e) => {
                e.preventDefault();

                if (resetPwdMode && resetCode != expectedResetCode)
                {
                    setMsg("Invalid Reset Code!");
                    return;
                }

                Login(email, password, resetPwdMode, setMsg);
              }}>
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-bold mb-2">Email</label>
                  
                  {
                  resetPwdMode 
                  ? <input
                        type="email"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-gray-200"
                        placeholder=""
                        value={email}
                        onChange={({target}) => setEmail(target.value)}
                        autoComplete='on'
                        required
                        disabled
                    />
                  : <input
                        type="email"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-gray-200"
                        placeholder=""
                        value={email}
                        onChange={({target}) => setEmail(target.value)}
                        autoComplete='on'
                        required
                    />
                }
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-bold mb-2">{resetPwdMode ? "New " : ""}Password</label>

                  <input
                    type="password"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-gray-200"
                    placeholder=""
                    value={password}
                    onChange={({target}) => setPassword(target.value)}
                    autoComplete='on'
                    required
                  />
                </div>

                {
                    resetPwdMode
                    ? <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2">Reset Code</label>
                        <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-gray-200"
                        placeholder=""
                        value={resetCode}
                        onChange={({target}) => setResetCode(target.value)}
                        autoComplete='on'
                        required
                        />

                        <button
                            className={`w-1/2 text-center py-2 border-b-2 border-green-500 text-green-500`}
                            onClick={() => CreateResetCode()}
                            type='button'
                        >
                            Create Reset Code
                        </button>
                    </div>
                  : <></>
                }

                <button
                  type="submit"
                  className="w-full bg-green-500 text-black py-2 rounded-md hover:bg-green-600 focus:outline-none"
                >
                  Login
                </button>

                {
                resetPwdMode 
                ? <p className="my-2 py-2 text-gray-500 hover:text-gray-200" style={{cursor: "pointer"}} onClick={() => setResetPwdMode(false)}>Remembered Password?</p>
                : <p className="my-2 py-2 text-gray-500 hover:text-gray-200" style={{cursor: "pointer"}} onClick={() => setResetPwdMode(true)}>Forgot Password?</p>
                }
              </form>
            ) : (
              <form onSubmit={(e) => {
                e.preventDefault();
                const uid = uuidv4();
                encryptPassword(uid, password).then((val) => CreateAccount(name, email, val, phonenumber, uid, setMsg, setIsLogin));
              }} >
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-bold mb-2">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-700 text-gray-200"
                    placeholder=""
                    value={name}
                    onChange={({target}) => setName(target.value)}
                    required
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
                    required
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
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-bold mb-2">Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-700 text-gray-200"
                    placeholder=""
                    value={password}
                    onChange={({target}) => setPassword(target.value)}
                    required
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