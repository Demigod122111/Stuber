"use client"

function uuidv4()
{
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

// Generate a random salt
const generateSalt = async () => {
const array = new Uint8Array(16);
window.crypto.getRandomValues(array);
return array;
};

// Derive a key from the password and salt
const deriveKey = async (password, salt) => {
const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
);

return window.crypto.subtle.deriveKey(
    {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
);
};

// Encrypt a plaintext password
export const encryptPassword = async (password, plaintext) => {
const salt = await generateSalt();
const key = await deriveKey(password, salt);

const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Initialization vector

const encodedText = new TextEncoder().encode(plaintext);
const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    encodedText
);

return {
    iv: Array.from(iv),
    salt: Array.from(salt),
    ciphertext: Array.from(new Uint8Array(encryptedBuffer))
};
};

// Decrypt an encrypted password
export const decryptPassword = async (password, encryptedData) => {
const { iv, salt, ciphertext } = encryptedData;
const key = await deriveKey(password, new Uint8Array(salt));

const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(iv) },
    key,
    new Uint8Array(ciphertext)
);

return new TextDecoder().decode(decryptedBuffer);
};