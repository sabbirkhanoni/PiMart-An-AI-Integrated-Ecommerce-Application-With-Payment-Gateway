import { Resend } from 'resend';
import dotenv from 'dotenv'

dotenv.config();

if(!process.env.RESEND_API){
    console.log("Please Provided RESEND_API in side the .env file Because API not Found")
}

const resend = new Resend(process.env.RESEND_API);

//Before Sending some Task have to be done
const sendEmail = async({sendTo, subject, html})=>{
    try {
        const { data, error } = await resend.emails.send({
            from: 'PiMart <onboarding@resend.dev>',
            to: sendTo,
            subject: subject,
            html: html,
          });

          if (error) {
            return console.error({ error });
          }

          return data;

    } catch (error) {
        console.log("In SendEmail.js File Error" +  error);
    }
}

export default sendEmail;
