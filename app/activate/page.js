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
        return (<div className="text-white p-6 rounded-lg shadow-lg max-w mx-auto flex justify-center">
            <div className="space-y-4 w-full flex items-center flex-col">
                <h1 className='text-lg text-green-500'>Your Account has been Activated!</h1>
                <Link href="/auth" className='text-center w-full text-blue-400 underline hover:text-blue-600'>Proceed to Login</Link>
            </div>
        </div>)
    } else {
        // Redirect if the activation code is invalid
        redirect('/auth');
    }
}
