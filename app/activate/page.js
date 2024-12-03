import Link from 'next/link';
import { sql } from '../modules/database';
import { redirect } from 'next/navigation';

export default async function Activate({ searchParams }) {
    const query = await searchParams;
    const email = query.email;
    const code = query.code;

    // Validate required query parameters
    if (!email || !code) {
        redirect('/auth'); // Redirect if parameters are missing
    }

    // Query the database
    const sqlres = await sql`SELECT email FROM users WHERE activationcode = ${code} AND email = ${email}`;

    if (sqlres.length > 0) {
        // Update the database if activation code matches
        await sql`UPDATE users SET activationcode = '' WHERE email = ${email}`;
        return <p>Account Activated! <Link href="/auth">Login</Link></p>
    } else {
        // Redirect if the activation code is invalid
        redirect('/auth');
    }
}
