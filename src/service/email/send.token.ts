import * as nodemailer from 'nodemailer';
import { config } from 'dotenv';

export type res = () => any;

export const sendEmailToken = async (
  email: string,
  token: string,
  type: string,
) => {
  config();
  const transporter = nodemailer.createTransport({
    port: 587,
    host: 'smtp-mail.outlook.com',
    secure: false,
    tls: {
      ciphers: 'SSLv3',
    },
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PW,
    },
  });
  const mailData = {
    from: process.env.EMAIL_ID,
    to: email,
    subject:
      type === 'SIGNUP' ? 'Email Verification Token' : 'Password Reset Token',
    text: `The token is ${token}`,
  };
  const mailResponse = await new Promise((res: (data: any) => void, rej) => {
    transporter.sendMail(mailData, (err, info) => {
      if (err) {
        console.log(err);
        rej(null);
      } else {
        res(info);
      }
    });
  });
  return mailResponse;
};
