import { NextRequest, NextResponse } from 'next/server';
import type { HealthFormData } from '../../hooks/useHealthForm';
import { getFilledFieldsSummary } from '../../utils/pdfGenerator';

// Esta función maneja el POST request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formData, language } = body as { formData: HealthFormData; language: 'es' | 'en' };

    // Validar que tenemos datos
    if (!formData || !formData.email) {
      return NextResponse.json(
        { error: language === 'es' ? 'Datos incompletos' : 'Incomplete data' },
        { status: 400 }
      );
    }

    // Generar el HTML del resumen
    const htmlSummary = getFilledFieldsSummary(formData, language);

    // Preparar el email
    const emailSubject = language === 'es' 
      ? `Cuestionario de Salud - ${formData.firstName} ${formData.lastName}`
      : `Health Questionnaire - ${formData.firstName} ${formData.lastName}`;

    const emailBody = `
      <!DOCTYPE html>
      <html lang="${language}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${emailSubject}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Poppins', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #212e5c 0%, #4285f4 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">zplendid</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">
              ${language === 'es' ? 'Cuestionario de Salud Completado' : 'Health Questionnaire Completed'}
            </p>
          </div>

          <!-- Mensaje de bienvenida -->
          <div style="padding: 30px 20px; background-color: #f9f9f9; border-bottom: 1px solid #e0e0e0;">
            <h2 style="color: #212e5c; margin: 0 0 10px 0; font-size: 20px;">
              ${language === 'es' ? '¡Gracias por completar el cuestionario!' : 'Thank you for completing the questionnaire!'}
            </h2>
            <p style="color: #555; margin: 0; line-height: 1.6;">
              ${language === 'es' 
                ? 'Hemos recibido tu información. Nuestro equipo médico la revisará y se pondrá en contacto contigo pronto.'
                : 'We have received your information. Our medical team will review it and contact you soon.'}
            </p>
          </div>

          <!-- Datos del formulario -->
          <div style="padding: 20px;">
            ${htmlSummary}
          </div>

          <!-- Footer -->
          <div style="background-color: #212e5c; padding: 20px; text-align: center; color: #ffffff;">
            <p style="margin: 0 0 10px 0; font-size: 14px;">
              <strong>zplendid</strong>
            </p>
            <p style="margin: 0; font-size: 12px; opacity: 0.8;">
              ${language === 'es' 
                ? 'Tu viaje hacia una mejor salud comienza aquí'
                : 'Your journey to better health starts here'}
            </p>
            <div style="margin-top: 15px; font-size: 11px; opacity: 0.7;">
              <p style="margin: 5px 0;">
                ${language === 'es' 
                  ? 'Este es un correo automático, por favor no responder.'
                  : 'This is an automated email, please do not reply.'}
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Aquí integrarías con tu servicio de email (nodemailer, sendgrid, etc.)
    // Por ahora, vamos a preparar la respuesta
    
    // En producción, aquí enviarías el email:
    /*
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      // Configuración de tu servidor SMTP
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: formData.email,
      subject: emailSubject,
      html: emailBody,
    });

    // También enviar a tu equipo
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: emailSubject,
      html: emailBody,
    });
    */

    // Por ahora, guardamos la información en consola y devolvemos éxito
    console.log('Formulario recibido:', {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      surgeryInterest: formData.surgeryInterest,
      submittedAt: new Date().toISOString(),
    });

    // Respuesta exitosa
    return NextResponse.json(
      {
        success: true,
        message: language === 'es' 
          ? 'Formulario enviado exitosamente' 
          : 'Form submitted successfully',
        emailPreview: emailBody, // Solo para desarrollo
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error al procesar el formulario:', error);
    return NextResponse.json(
      { error: 'Error al procesar el formulario' },
      { status: 500 }
    );
  }
}

// Opción para GET (por si quieres probar la API)
export async function GET() {
  return NextResponse.json(
    { 
      message: 'Endpoint para envío de formularios de salud de zplendid',
      method: 'POST',
      status: 'active'
    },
    { status: 200 }
  );
}

