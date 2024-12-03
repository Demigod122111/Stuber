"use server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (receiver, subject, body) => {
    const res = await resend.emails.send({
        from: "Stuber <info@stuber.store>",
        to: receiver,
        subject,
        html: body
    })

    return res;
}