import { sendEmail } from "./email";
import { generateSixDigitCode } from "./misc";

export default async function ResetPwd(receiver)
{
    try 
    {
        const code = generateSixDigitCode();

        await sendEmail(
            receiver,
            "Reset your Stuber Password (Do not reply)", 
            `<p>Your reset code is <strong>${code}</strong><br><hr>If you did not request this code, please ignore this email.</p>`);

        return code;
    } 
    catch (error) {
        console.error(error);
        return false;
    }
}