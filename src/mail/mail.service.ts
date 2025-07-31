import { Injectable, Logger } from '@nestjs/common'; // Importa Logger
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: Transporter;
  private readonly logger = new Logger(MailService.name); // Instancia de Logger

  constructor() {
    // --- CONFIGURACIÓN DEL TRANSPORTADOR DE CORREO ---
    // Aquí debes configurar tu servicio de correo.
    // Para pruebas, puedes usar un servicio como Mailtrap.io o un correo de Gmail.
    // Para producción, considera servicios como SendGrid, Mailgun, etc.

    // EJEMPLO CON GMAIL (Solo para PRUEBAS - No recomendado para producción real)
    // Asegúrate de usar una "Contraseña de aplicación" si tienes 2FA en Gmail.
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'faberdserna97@gmail.com', // <-- ¡REEMPLAZA CON TU EMAIL!
        pass: 'tqva gizm akqf xake', // <-- ¡REEMPLAZA CON TU CONTRASEÑA O CONTRASEÑA DE APLICACIÓN!
      },
    });

    // EJEMPLO CON UN SERVIDOR SMTP GENÉRICO (para otros proveedores)
    /*
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ejemplo.com', // Reemplaza con el host SMTP de tu proveedor
      port: 587,                // Reemplaza con el puerto SMTP (587 para TLS/STARTTLS, 465 para SSL)
      secure: false,            // true si el puerto es 465 (SSL), false si es 587 (STARTTLS)
      auth: {
        user: 'tu_usuario_smtp',    // Tu usuario SMTP
        pass: 'tu_contraseña_smtp', // Tu contraseña SMTP
      },
    });
    */
    // --- FIN CONFIGURACIÓN ---
  }

  async sendMail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<void> {
    const mailOptions = {
      from: '"Tu Banco App" <info@tubanco.com>', // Remitente. ¡CAMBIA ESTE EMAIL TAMBIÉN!
      to, // Destinatario(s)
      subject, // Asunto del correo
      text, // Contenido en texto plano
      html, // Contenido en HTML (opcional, ideal para correos bonitos)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(
        `Correo enviado a: ${to}. ID del mensaje: ${info.messageId}`,
      );
    } catch (error) {
      this.logger.error(`Error al enviar correo a: ${to}`, error.stack);
      // Opcional: relanzar el error o manejarlo de otra forma
      throw new Error(`Fallo al enviar el correo a ${to}`);
    }
  }
}
