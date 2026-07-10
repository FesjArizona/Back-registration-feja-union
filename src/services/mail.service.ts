import nodemailer from 'nodemailer';
import { UserDataRegister } from '../interfaces/register.interface';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dany.cachorro03@gmail.com',
        pass: 'uzlj emfq ovhp uoez'
    }
});

export const sendConfirmationMail = async (data: UserDataRegister) => {
    try {
        const emergenciaTexto = `${data.contacto_emergencia.nombre_contacto || 'No especificado'} · ${data.contacto_emergencia.telefono_contacto || ''}`;
        const htmlTemplate = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                
                <h1 style="color: #1a202c; text-align: center; margin-bottom: 5px;">¡Registro Confirmado!</h1>
                <p style="text-align: center; color: #64748b; margin-top: 0; margin-bottom: 30px;">
                    Tu información ha sido guardada correctamente.<br/>
                    A continuación, te presentamos el resumen de tu registro al congreso.
                </p>

                <!-- Tarjeta de Resumen -->
                <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; background-color: #ffffff;">
                    <!-- Fila Nombre -->
                    <tr>
                        <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9;">
                            <span style="font-size: 18px; color: #10b981; margin-right: 10px;">👤</span>
                            <strong style="color: #334155;">Nombre:</strong>
                        </td>
                        <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; text-align: right;">
                            ${data.nombre}
                        </td>
                    </tr>
                    
                    <!-- Fila Email -->
                    <tr>
                        <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9;">
                            <span style="font-size: 18px; color: #10b981; margin-right: 10px;">✉️</span>
                            <strong style="color: #334155;">Conferencia:</strong>
                        </td>
                        <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; text-align: right;">
                            ${data.nombre_conferencia}
                        </td>
                    </tr>

                    <!-- Fila Teléfono -->
                    <tr>
                        <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9;">
                            <span style="font-size: 18px; color: #10b981; margin-right: 10px;">📞</span>
                            <strong style="color: #334155;">Estado</strong>
                        </td>
                        <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; text-align: right;">
                            ${data.nombre_estado}
                        </td>
                    </tr>

                    <!-- Fila Iglesia -->
                    <tr>
                        <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9;">
                            <span style="font-size: 18px; color: #10b981; margin-right: 10px;">⛪</span>
                            <strong style="color: #334155;">Iglesia:</strong>
                        </td>
                        <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; text-align: right;">
                            ${data.iglesia}
                        </td>
                    </tr>

                  

                    <!-- Fila Emergencia -->
                    <tr>
                        <td style="padding: 15px 0;">
                            <span style="font-size: 18px; color: #10b981; margin-right: 10px;">👥</span>
                            <strong style="color: #334155;">Emergencia:</strong>
                        </td>
                        <td style="padding: 15px 0; color: #64748b; text-align: right;">
                            ${emergenciaTexto}
                        </td>
                    </tr>
                </table>

                <!-- Botón Decorativo Inferior -->
                <div style="text-align: center; margin-top: 30px;">
                    <a href="[https://tu-sitio-web-del-evento.com](https://tu-sitio-web-del-evento.com)" style="background-color: #10b981; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                        Ir a la página del evento ❯
                    </a>
                </div>
                
                <p style="text-align: center; font-size: 12px; color: #94a3b8; margin-top: 40px;">
                    Este es un correo automático generado por el sistema de registro. Por favor no respondas a esta dirección.
                </p>
            </div>
        `;

        const mailOptions = {
            from: '"FEJA 2026" <tu_correo_del_evento@gmail.com>',
            to: data.correo,
            subject: 'Confirmación de Registro - FEJA 2026 🎉',
            html: htmlTemplate
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado exitosamente: ' + info.messageId);

        return true;
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        return false;
    }
};