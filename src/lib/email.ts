import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendContactEmail(
  name: string,
  email: string,
  subject: string,
  message: string
) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Contact: ${subject}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}
