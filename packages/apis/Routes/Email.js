import express from 'express';
import nodemailer from 'nodemailer';
import Email from '../Models/Email.js';

const router = express.Router();

// Configure Nodemailer with SMTP settings
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Route to send an email
router.post('/send', async (req, res) => {
  const { to, subject, text, html } = req.body;
  let email; // Declare the email variable outside the try block

  try {
    // Save the email to the database (optional)
    email = new Email({
      to,
      subject,
      text,
      html,
      status: 'pending',
    });
    await email.save();

    // Send the email using Nodemailer
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
      html,
    });

    // Update the email status to 'sent'
    email.status = 'sent';
    await email.save();

    res.status(200).json({ message: 'Email sent successfully', info });
  } catch (error) {
    console.error('Failed to send email:', error);

    // Update the email status to 'failed' if saving to the database
    if (email) {
      email.status = 'failed';
      await email.save();
    }

    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
});

export {router as emailRouter}