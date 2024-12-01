"use server"
import { Resend } from "resend"

function generateSixDigitCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export default async function ResetPwd(receiver)
{
    try 
    {
        const resend = new Resend(process.env.RESEND_API_KEY);

        const code = generateSixDigitCode();

        const res = await resend.emails.send({
            from: "Stuber <stuber@resend.dev>",
            to: receiver,
            subject: "Reset your Stuber Password (Do not reply)",
            html: `<p>Your reset code is <strong>${code}</strong><br><hr>If you did not request this code, please ignore this email.</p>`
        })

        return code;
    } 
    catch (error) {
        console.error(error);
        return false;
    }
}