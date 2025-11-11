import nodemailer from 'nodemailer';
import { SystemSettingsModel } from '../models/SystemSettings';

// Configuración del transporter de nodemailer
const createTransporter = async () => {
  const config = await SystemSettingsModel.getEmailConfig();
  
  // Validar que tenemos credenciales
  if (!config.user || !config.password) {
    throw new Error('Las credenciales de email no están configuradas. Por favor, configura SMTP_USER y SMTP_PASSWORD en las variables de entorno o en la configuración del sistema.');
  }
  
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465, // true para 465, false para otros puertos
    auth: {
      user: config.user,
      pass: config.password,
    },
  });
};

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  /**
   * Enviar email de bienvenida a un nuevo doctor
   */
  static async sendWelcomeEmailToDoctor(
    email: string,
    firstName: string,
    temporaryPassword: string,
    language: string = 'es'
  ): Promise<boolean> {
    try {
      const transporter = await createTransporter();
      const config = await SystemSettingsModel.getEmailConfig();
      const baseUrl = await SystemSettingsModel.getSetting('BASE_URL') || 'http://localhost:3000';

      const verificationLink = `${baseUrl}/auth/verify-doctor?email=${encodeURIComponent(email)}`;
      
      const emailContent = language === 'es' 
        ? this.getWelcomeEmailTemplateES(firstName, temporaryPassword, verificationLink)
        : this.getWelcomeEmailTemplateEN(firstName, temporaryPassword, verificationLink);

      const mailOptions = {
        from: `"${config.fromName}" <${config.fromEmail}>`,
        to: email,
        subject: language === 'es' 
          ? 'Bienvenido a Zplendid - Creación de cuenta' 
          : 'Welcome to Zplendid - Account Created',
        html: emailContent.html,
        text: emailContent.text,
      };

      await transporter.sendMail(mailOptions);
      console.log('✅ Email de bienvenida enviado correctamente a:', email);
      return true;
    } catch (error) {
      console.error('❌ Error al enviar email de bienvenida:', error);
      return false;
    }
  }

  /**
   * Template de email en español
   */
  private static getWelcomeEmailTemplateES(
    firstName: string,
    temporaryPassword: string,
    verificationLink: string
  ) {
    return {
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bienvenido a Zplendid</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #212e5c; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">zplendid</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Sistema de Gestión Médica</p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
            <h2 style="color: #212e5c; margin-top: 0;">¡Bienvenido/a, ${firstName}!</h2>
            
            <p style="margin-bottom: 20px;">
              Tu cuenta de doctor ha sido creada exitosamente en el sistema Zplendid.
            </p>

            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
              <h3 style="color: #92400e; margin-top: 0;">📋 Credenciales de Acceso</h3>
              <p style="margin: 5px 0;"><strong>Contraseña Temporal:</strong></p>
              <div style="background-color: white; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 18px; font-weight: bold; color: #212e5c; text-align: center;">
                ${temporaryPassword}
              </div>
              <p style="margin: 10px 0 0 0; font-size: 14px; color: #92400e;">
                ⚠️ Por seguridad, cambia esta contraseña después de tu primer acceso.
              </p>
            </div>

            <div style="margin: 30px 0;">
              <h3 style="color: #212e5c;">🔐 Siguiente Paso</h3>
              <p>Para activar tu cuenta y completar el proceso de verificación, haz clic en el siguiente botón:</p>
              
              <div style="text-align: center; margin: 25px 0;">
                <a href="${verificationLink}" 
                   style="display: inline-block; background-color: #212e5c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                  Activar Mi Cuenta
                </a>
              </div>

              <p style="color: #6b7280; font-size: 14px; margin-top: 15px;">
                Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
                <span style="color: #2563eb; word-break: break-all;">${verificationLink}</span>
              </p>
            </div>

            <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
              <h3 style="color: #065f46; margin-top: 0;">✨ Importante</h3>
              <ul style="margin: 10px 0; padding-left: 20px; color: #047857;">
                <li>Tu cuenta será <strong>activada automáticamente</strong> al iniciar sesión por primera vez</li>
                <li>Recibirás acceso completo al panel de doctores de Zplendid</li>
                <li>Podrás gestionar pacientes y sus expedientes médicos</li>
              </ul>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

            <p style="color: #6b7280; font-size: 14px; margin-bottom: 5px;">
              Si tienes alguna pregunta, no dudes en contactarnos.
            </p>
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              <strong>El equipo de Zplendid</strong>
            </p>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>Este es un email automático, por favor no respondas a este mensaje.</p>
            <p>&copy; 2025 Zplendid. Todos los derechos reservados.</p>
          </div>
        </body>
        </html>
      `,
      text: `
Bienvenido/a a Zplendid, ${firstName}!

Tu cuenta de doctor ha sido creada exitosamente.

CREDENCIALES DE ACCESO:
Contraseña Temporal: ${temporaryPassword}

⚠️ Por seguridad, cambia esta contraseña después de tu primer acceso.

Para activar tu cuenta, visita: ${verificationLink}

IMPORTANTE:
- Tu cuenta será activada automáticamente al iniciar sesión por primera vez
- Recibirás acceso completo al panel de doctores de Zplendid
- Podrás gestionar pacientes y sus expedientes médicos

Saludos,
El equipo de Zplendid
      `
    };
  }

  /**
   * Template de email en inglés
   */
  private static getWelcomeEmailTemplateEN(
    firstName: string,
    temporaryPassword: string,
    verificationLink: string
  ) {
    return {
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Zplendid</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #212e5c; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">zplendid</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Medical Management System</p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
            <h2 style="color: #212e5c; margin-top: 0;">Welcome, ${firstName}!</h2>
            
            <p style="margin-bottom: 20px;">
              Your doctor account has been successfully created in the Zplendid system.
            </p>

            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
              <h3 style="color: #92400e; margin-top: 0;">📋 Login Credentials</h3>
              <p style="margin: 5px 0;"><strong>Temporary Password:</strong></p>
              <div style="background-color: white; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 18px; font-weight: bold; color: #212e5c; text-align: center;">
                ${temporaryPassword}
              </div>
              <p style="margin: 10px 0 0 0; font-size: 14px; color: #92400e;">
                ⚠️ For security, please change this password after your first login.
              </p>
            </div>

            <div style="margin: 30px 0;">
              <h3 style="color: #212e5c;">🔐 Next Step</h3>
              <p>To activate your account and complete the verification process, click the button below:</p>
              
              <div style="text-align: center; margin: 25px 0;">
                <a href="${verificationLink}" 
                   style="display: inline-block; background-color: #212e5c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                  Activate My Account
                </a>
              </div>

              <p style="color: #6b7280; font-size: 14px; margin-top: 15px;">
                If the button doesn't work, copy and paste this link in your browser:<br>
                <span style="color: #2563eb; word-break: break-all;">${verificationLink}</span>
              </p>
            </div>

            <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
              <h3 style="color: #065f46; margin-top: 0;">✨ Important</h3>
              <ul style="margin: 10px 0; padding-left: 20px; color: #047857;">
                <li>Your account will be <strong>automatically activated</strong> when you log in for the first time</li>
                <li>You'll receive full access to the Zplendid doctor panel</li>
                <li>You'll be able to manage patients and their medical records</li>
              </ul>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

            <p style="color: #6b7280; font-size: 14px; margin-bottom: 5px;">
              If you have any questions, please don't hesitate to contact us.
            </p>
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              <strong>The Zplendid Team</strong>
            </p>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>This is an automated email, please do not reply to this message.</p>
            <p>&copy; 2025 Zplendid. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
      text: `
Welcome to Zplendid, ${firstName}!

Your doctor account has been successfully created.

LOGIN CREDENTIALS:
Temporary Password: ${temporaryPassword}

⚠️ For security, please change this password after your first login.

To activate your account, visit: ${verificationLink}

IMPORTANT:
- Your account will be automatically activated when you log in for the first time
- You'll receive full access to the Zplendid doctor panel
- You'll be able to manage patients and their medical records

Regards,
The Zplendid Team
      `
    };
  }

  /**
   * Enviar PDF del expediente médico al paciente por email
   */
  static async sendPatientPDFEmail(
    email: string,
    firstName: string,
    lastName: string,
    pdfBuffer: Buffer,
    pdfFileName: string,
    language: string = 'es'
  ): Promise<boolean> {
    try {
      const transporter = await createTransporter();
      const config = await SystemSettingsModel.getEmailConfig();

      const subject = language === 'es'
        ? `Tu Expediente Médico - ${firstName} ${lastName}`
        : `Your Medical Record - ${firstName} ${lastName}`;

      const emailContent = language === 'es'
        ? this.getPatientPDFEmailTemplateES(firstName, lastName)
        : this.getPatientPDFEmailTemplateEN(firstName, lastName);

      const mailOptions = {
        from: `"${config.fromName}" <${config.fromEmail}>`,
        to: email,
        subject: subject,
        html: emailContent.html,
        text: emailContent.text,
        attachments: [
          {
            filename: pdfFileName,
            content: pdfBuffer,
            contentType: 'application/pdf'
          }
        ]
      };

      await transporter.sendMail(mailOptions);
      console.log('✅ Email con PDF enviado correctamente a:', email);
      return true;
    } catch (error: any) {
      console.error('❌ Error al enviar email con PDF:', error);
      
      // Mensajes de error más descriptivos
      if (error?.code === 'EAUTH') {
        console.error('🔐 Error de autenticación SMTP:');
        console.error('   - Verifica que SMTP_USER y SMTP_PASSWORD estén correctos en .env');
        console.error('   - Si usas Gmail, necesitas una "Contraseña de aplicación" (no tu contraseña normal)');
        console.error('   - Ve a: https://myaccount.google.com/apppasswords');
      }
      
      return false;
    }
  }

  /**
   * Template de email en español para envío de PDF
   */
  private static getPatientPDFEmailTemplateES(
    firstName: string,
    lastName: string
  ) {
    return {
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Tu Expediente Médico</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #212e5c; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">zplendid</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Sistema de Gestión Médica</p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
            <h2 style="color: #212e5c; margin-top: 0;">Hola ${firstName},</h2>
            
            <p style="margin-bottom: 20px;">
              Te enviamos una copia de tu expediente médico en formato PDF adjunto a este correo.
            </p>

            <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
              <h3 style="color: #065f46; margin-top: 0;">📄 Archivo Adjunto</h3>
              <p style="margin: 5px 0; color: #047857;">
                Encontrarás tu expediente médico completo en el archivo PDF adjunto a este correo.
              </p>
            </div>

            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
              <h3 style="color: #92400e; margin-top: 0;">🔒 Confidencialidad</h3>
              <p style="margin: 5px 0; color: #92400e; font-size: 14px;">
                Este documento contiene información médica confidencial. Por favor, mantén este archivo seguro y no lo compartas con personas no autorizadas.
              </p>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

            <p style="color: #6b7280; font-size: 14px; margin-bottom: 5px;">
              Si tienes alguna pregunta sobre tu expediente médico, no dudes en contactarnos.
            </p>
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              <strong>El equipo de Zplendid</strong>
            </p>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>Este es un email automático, por favor no respondas a este mensaje.</p>
            <p>&copy; 2025 Zplendid. Todos los derechos reservados.</p>
          </div>
        </body>
        </html>
      `,
      text: `
Hola ${firstName},

Te enviamos una copia de tu expediente médico en formato PDF adjunto a este correo.

ARCHIVO ADJUNTO:
Encontrarás tu expediente médico completo en el archivo PDF adjunto a este correo.

CONFIDENCIALIDAD:
Este documento contiene información médica confidencial. Por favor, mantén este archivo seguro y no lo compartas con personas no autorizadas.

Si tienes alguna pregunta sobre tu expediente médico, no dudes en contactarnos.

El equipo de Zplendid

Este es un email automático, por favor no respondas a este mensaje.
© 2025 Zplendid. Todos los derechos reservados.
      `
    };
  }

  /**
   * Template de email en inglés para envío de PDF
   */
  private static getPatientPDFEmailTemplateEN(
    firstName: string,
    lastName: string
  ) {
    return {
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Medical Record</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #212e5c; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">zplendid</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Medical Management System</p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
            <h2 style="color: #212e5c; margin-top: 0;">Hello ${firstName},</h2>
            
            <p style="margin-bottom: 20px;">
              We are sending you a copy of your medical record in PDF format attached to this email.
            </p>

            <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
              <h3 style="color: #065f46; margin-top: 0;">📄 Attached File</h3>
              <p style="margin: 5px 0; color: #047857;">
                You will find your complete medical record in the PDF file attached to this email.
              </p>
            </div>

            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
              <h3 style="color: #92400e; margin-top: 0;">🔒 Confidentiality</h3>
              <p style="margin: 5px 0; color: #92400e; font-size: 14px;">
                This document contains confidential medical information. Please keep this file secure and do not share it with unauthorized persons.
              </p>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

            <p style="color: #6b7280; font-size: 14px; margin-bottom: 5px;">
              If you have any questions about your medical record, please don't hesitate to contact us.
            </p>
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              <strong>The Zplendid Team</strong>
            </p>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>This is an automated email, please do not reply to this message.</p>
            <p>&copy; 2025 Zplendid. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
      text: `
Hello ${firstName},

We are sending you a copy of your medical record in PDF format attached to this email.

ATTACHED FILE:
You will find your complete medical record in the PDF file attached to this email.

CONFIDENTIALITY:
This document contains confidential medical information. Please keep this file secure and do not share it with unauthorized persons.

If you have any questions about your medical record, please don't hesitate to contact us.

The Zplendid Team

This is an automated email, please do not reply to this message.
© 2025 Zplendid. All rights reserved.
      `
    };
  }
}

