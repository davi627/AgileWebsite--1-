import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import Email from '../Models/Email.js';


dotenv.config();

const router = express.Router();

// SMTP Configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

router.post('/send', async (req, res) => {
  const { to, subject, text, html } = req.body;

  if (!to || !subject || !text || !html) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
      html,
    });

    // Save email record in DB
    const email = new Email({ to, subject, text, html });
    await email.save();

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email' });
  }
});

export {router as emailRouter}
