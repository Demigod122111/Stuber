"use client"

import { sql } from "./database";

export function generateSixDigitCode() 
{
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateNDigitCode(n) 
{
    return Math.floor(Math.pow(10, n - 1) + Math.random() * (9 * Math.pow(10, n - 1))).toString();
}

export function generateNCharCode(n) 
{
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';

    for (let i = 0; i < n; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }

    return code;
}

export function getHostDomain(url) {
    const parsedUrl = new URL(url);
    const hostDomain = `${parsedUrl.protocol}//${parsedUrl.hostname}`;

    // Include port if it's not the default port
    if ((parsedUrl.hostname === 'localhost' || parsedUrl.hostname === '127.0.0.1') && parsedUrl.port) {
        return `${hostDomain}:${parsedUrl.port}`;
    }

    // Otherwise, just return the host domain (without port)
    return hostDomain;
}

export const GetUserData = (setUserData, setters) => {
    const getUserData = async (id, session) => {
        const data = await sql`SELECT * FROM users WHERE id=${id} AND currentsession=${session}`;
        if (data.length > 0 && setUserData != undefined)
            setUserData(data[0]);

        if (setters != undefined)
        {
            Object.keys(setters).forEach((key) => {
                setters[key](data[0][key]);
            });
        }

        return data[0];
    }

    return getUserData(localStorage.getItem("cuser"), localStorage.getItem("csession"));
}

export const UpdateUserData = (field, data) => {
    const updateUserData = async (id, session) => {
        const query = `UPDATE users SET ${field} = $1 WHERE id = $2 AND currentsession = $3`;
        await sql(query, [data, id, session]);
    }

    return updateUserData(localStorage.getItem("cuser"), localStorage.getItem("csession"));
}

export const UpdateGlobalUserData = (email, field, data) => {
    const updateUserData = async (email) => {
        const query = `UPDATE users SET ${field} = $1 WHERE email = $2`;
        await sql(query, [data, email]);
    }

    return updateUserData(email);
}

export function customFormatDate(date) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ];

    const hours = date.getHours() % 12 || 12; // 12-hour format
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${hours}:${minutes} ${ampm}`;
}

export function customFormatDateInUTC(date) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ];

    const hours = date.getUTCHours() % 12 || 12; // 12-hour format, UTC
    const minutes = String(date.getUTCMinutes()).padStart(2, '0'); // UTC minutes
    const ampm = date.getUTCHours() >= 12 ? 'PM' : 'AM';

    return `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()} ${hours}:${minutes} ${ampm} UTC`;
}

export function toSentenceCase(str) {
    if (!str) return ''; // Handle empty or null strings
    // Trim spaces, convert the first character to uppercase and the rest to lowercase
    return str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase();
}

export function toTitleCase(str) {
    if (!str) return ''; // Handle empty or null strings
    return str
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}