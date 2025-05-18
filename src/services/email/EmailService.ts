import nodemailer from "nodemailer";
import { config } from "../../config/config";


export class EmailService {
  private transporter: nodemailer.Transporter;
  
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: config.email,
        pass: config.password,
      },
    });
  }

  /**
   * Send an email
   * @param to Recipient email address
   * @param subject Email subject
   * @param htmlContent HTML content of the email
   * @returns Promise resolving to the send result
   */
  async sendMail(to: string, subject: string, htmlContent: string): Promise<boolean> {
    const options = {
      from: config.email,
      to,
      subject,
      html: htmlContent,
    };

    try {
      const result = await this.transporter.sendMail(options);
      console.log("Mail sent:", result.response);
      return true;
    } catch (error) {
      console.error("Error sending mail:", error);
      return false;
    }
  }

  /**
   * Send a password reset email
   * @param to Recipient email address
   * @param resetLink Password reset link
   * @returns Promise resolving to the send result
   */
  async sendResetPasswordEmail(to: string, resetLink: string): Promise<boolean> {
    const subject = "Password Reset Request";
    const htmlContent = `
      <h1>Password Reset</h1>
      <p>You requested a password reset for your account.</p>
      <p>Please click the link below to reset your password:</p>
      <p><a href="${resetLink}">Reset Password</a></p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>This link will expire in 20 minutes.</p>
      <p>Best regards,</p>
      <p>The Kudos Team</p>
    `;
    
    return this.sendMail(to, subject, htmlContent);
  }

  // Send kudos email
  async sendKudosEmail(to: string, sender: string, receiver: string, team: string, category: string, message: string): Promise<boolean> {
    const subject = "Kudos Received";
    const htmlContent = `
      <h1>Kudos Received</h1>
      <p>You have received a kudos from ${sender} in ${team} for ${category}.</p>
      <p>Message: ${message}</p>
      <p>Best regards,</p>
      <p>The Kudos Team</p>
    `;
    
    return this.sendMail(to, subject, htmlContent);
  }
} 