import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'faberdserna97@gmail.com',
        pass: 'tqva gizm akqf xake',
      },
    });
  }

  async sendMail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<void> {
    const mailOptions = {
      from: '"Tu Banco App" <info@tubanco.com>',
      to,
      subject,
      text,
      html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(
        `Correo enviado a: ${to}. ID del mensaje: ${info.messageId}`,
      );
    } catch (error) {
      this.logger.error(`Error al enviar correo a: ${to}`, error.stack);

      throw new Error(`Fallo al enviar el correo a ${to}`);
    }
  }
}
