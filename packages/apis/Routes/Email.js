import express from 'express';
import nodemailer from 'nodemailer';
import { getConfig } from '../configManager.js';
import Email from '../Models/Email.js';

const router = express.Router();

// SMTP Configuration
const transporter = nodemailer.createTransport({
  host: getConfig('SMTP_HOST'),
  port: getConfig('SMTP_PORT'),
  secure: false, 
  auth: {
    user: getConfig('SMTP_USER'),
    pass: getConfig('SMTP_PASS'),
  },
  tls: {
    ciphers: 'TLSv1.2', 
    rejectUnauthorized: false, 
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
      from: getConfig('SMTP_FROM'),
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

export { router as emailRouter }