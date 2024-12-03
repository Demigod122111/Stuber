"use client"

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