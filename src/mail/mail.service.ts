import nodemailer from 'nodemailer';

export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'no.reply.honeybrain@gmail.com',
        pass: 'hSC55anx7R85Gt',
      },
    });
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions = {
      from: 'no.reply.honeybrain@gmail.com',
      to: to,
      subject: subject,
      html: html,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendActivationMail(email: string, activationLink: string): Promise<void> {
    const subject = 'Honeybrain Account Activation';
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">Welcome to Honeybrain!</h2>
        <p>Thank you for signing up with Honeybrain. Before getting started, please activate your account by clicking on the link below:</p>
        <a href="${activationLink}" style="background-color: #4CAF50; padding: 10px 15px; color: white; text-decoration: none; border-radius: 5px;">Activate My Account</a>
        <p>If you did not create an account with Honeybrain, please simply disregard this email.</p>
        <br/>
        <p>Warm regards,</p>
        <p>The Honeybrain Team</p>
      </div>
    `;

    await this.sendMail(email, subject, htmlContent);
  }
}
