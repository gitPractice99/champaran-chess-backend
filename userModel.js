import { Schema, model } from "mongoose";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import google from "googleapis";

dotenv.config();
const OAuth2 = google.Auth.OAuth2Client;

const userSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  parant: {
    type: String,
  },
  kidsname: {
    type: String,
  },
  kidsage: {
    type: String,
  },
  country: {
    type: String,
  },
  experiance: {
    type: Object,
  },
  description: String,
});

const createTransporter = async (title,body) => {
  try {
    const oauth2Client = new OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
      access_token:process.env.ACCESS_TOKEN,
      refresh_token: process.env.REFRESH_TOKEN,
    });

    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          console.log("*ERR: ", err);
          reject();
        }
        resolve(token);
      });
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL,
        accessToken:accessToken,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
      },
    });
    const mailOptions = {
      from: process.env.GMAIL,
      to: "googlifaqt@gmail.com",
      subject: title,
      html: body,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
    return err;
  }
};

async function sendVerificationEmail(
  email,
  name,
  phone,
  kidsname,
  kidsage,
  parent,
  country,
  experiance
) {
  try {
    const result = createTransporter(
      "New User Registered",
      `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>User Booked a Demo Class</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    
        <table style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <tr>
                <td>
                    <img src="https://frolicking-mermaid-1851d6.netlify.app/assets/champaran-chess-academy-removebg-preview.png " alt="Company Logo" style="display: block; margin: 0 auto; max-width: 200px; border-radius:999rem;">
                </td>
            </tr>
            <tr>
                <td style="padding-top: 20px;">
                    <h2 style="text-align: center; color: #333;">New Demo Class Booking Request Here call or email for further details</h2>
                </td>
            </tr>
            <tr>
                <td style="padding: 20px;">
                    <p style="font-size: 16px; line-height: 1.6;">Dear ${name},</p>
                
                    <p style="font-size: 16px; line-height: 1.6;">Your Details:</p>
                    <ul style="font-size: 16px; line-height: 1.6;">
                        <li><strong>Email:</strong> ${email}</li>
                        <li><strong>Phone:</strong> ${phone}</li>
                        <li><strong>Kids Name:</strong>${kidsname}</li>
                        <li><strong>Kids Age:</strong> ${kidsage}</li>
                        <li><strong>Country:</strong> ${country}</li>
                        <li><strong>Experience:</strong> ${experiance.id}</li>
                    </ul>
                 
                    <p style="font-size: 16px; line-height: 1.6;">Best Regards,<br>Champaran Chess Academy</p>
                </td>
            </tr>
        </table>
    
        <!-- Admin Information -->
        <table style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px;">
            <tr>
                <td>
                    <h2 style="text-align: center; color: #333;">Admin Information</h2>
                </td>
            </tr>
            <tr>
                <td style="padding: 20px;">
                    <p style="font-size: 16px; line-height: 1.6;"><strong>Name: ${name}</strong></p>
                    <p style="font-size: 16px; line-height: 1.6;"><strong>Email: ${email}</strong></p>
                    <p style="font-size: 16px; line-height: 1.6;"><strong>Phone: ${phone}</strong></p>
                </td>
            </tr>
        </table>
    
    </body>
    </html>
    `
    );
  
  } catch (err) {
    console.log("Error occoured while sending mails : ", err);
    throw err;
  }
}

userSchema.pre("save", async function (next) {
  sendVerificationEmail(
    this.email,
    this.name,
    this.phone,
    this.kidsname,
    this.kidsage,
    this.parant,
    this.country,
    this.experiance
  );
  next();
});
const User = new model("User", userSchema);
export default User;
