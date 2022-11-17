import { FROM_EMAIL, FROM_EMAIL_PASSWORD, NODE_ENV } from '@/config';
import nodemailer from 'nodemailer'

class EmailService {
    private transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: FROM_EMAIL,
            pass: FROM_EMAIL_PASSWORD,
        },
    })
    public async sendWelcomeMail(name: string, email: string): Promise<void> {
        // return if development env
        if (NODE_ENV === "development")
            return
        const htmlBody = '<img style="width:250px;" src="cid:logo"><br/><br/>Hola ' + name + ' ¡Felicidades! Tu registro se ha completado con éxito.<br/><br/>Ya puedes disfrutar de THEGESTOR totalmente Gratis para gestionar tu negocio.<br/><br/>Con THEGESTOR tienes las funcionalidades que necesitas para gestionar tu negocio, presentar tus impuestos y tomar el control de tus gastos para ahorrar en tu factura fiscal:<br/><ul><li>Crear y organizar tus productos y servicios</li><li>Crear y enviar tus facturas personalizadas y hacer seguimiento del cobro</li><li>Subir tus gastos y tickets haciendo una foto con tu móvil</li><li>Conectar con tu banco para conciliar tus ingresos y gastos</li><li>Ver tus impuestos de IVA e IRPF en tiempo real</li><li>Guardar, consultar y descargar tus estados financieros desde cualquier lugar</li><li>Crear un usuario totalmente gratuito para que tu gestoría tenga acceso en tiempo real a todos tus ingresos y gastos.</li></ul><br/>Accede a THEGESTOR desde tu PC o desde el móvil descargando la aplicación.<br/><br/><a href="https://thegestor.app"><div style="display:inline-block;border-radius:8px;padding:10px 15px;background-color:#304799"><b style="color:white;font-size:14px;text-decoration:none;">Visita TheGestor</b></div></a><br/><br/>Recuerda que si necesitas ayuda para presentar impuestos o para gestionar tu contabilidad siempre tienes a tu disposición la ayuda de nuestros gestores contables y fiscales que te ayudarán desde el chat de la aplicación.<br/><br/>Un Saludo,<br/><br/>Lorenz Dos Ramos<br/>Customer Success TheGestor<br/><a href = "mailto:clientes@thegestor.com">clientes@thegestor.com</a><br/><a href="tel:+34633779821">+34 633 77 98 21</a>'
        const textBody = 'Hola ' + name +
            ` ¡Felicidades! Tu registro se ha completado con éxito.
            
    Ya puedes disfrutar de THEGESTOR totalmente Gratis para gestionar tu negocio.
    
    Con THEGESTOR tienes las funcionalidades que necesitas para gestionar tu negocio, presentar tus impuestos y tomar el control de tus gastos para ahorrar en tu factura fiscal:
     - Crear y organizar tus productos y servicios
     - Crear y enviar tus facturas personalizadas y hacer seguimiento del cobro
     - Subir tus gastos y tickets haciendo una foto con tu móvil
     - Conectar con tu banco para conciliar tus ingresos y gastos
     - Ver tus impuestos de IVA e IRPF en tiempo real
     - Guardar, consultar y descargar tus estados financieros desde cualquier lugar
     - Crear un usuario totalmente gratuito para que tu gestoría tenga acceso en tiempo real a todos tus ingresos y gastos.
    
    Accede a THEGESTOR desde tu PC o desde el móvil descargando la aplicación.
    
    Recuerda que si necesitas ayuda para presentar impuestos o para gestionar tu contabilidad siempre tienes a tu disposición la ayuda de nuestros gestores contables y fiscales que te ayudarán desde el chat de la aplicación.
    
    
    Un Saludo,
    
    Lorenz Dos Ramos
    Customer Success TheGestor
    clientes@thegestor.com
    +34 633 77 98 21`
        let mailOptions = {
            from: FROM_EMAIL,
            to: email,
            subject: "Tu registro en The Gestor se ha completado con éxito.",
            text: textBody,
            attachments: [{
                filename: 'logo.jpeg',
                path: process.cwd() + '/assets/logo.jpeg',
                cid: 'logo'
            }],
            html: htmlBody,

        };
        await this.transporter.sendMail(mailOptions)
    }

    public async sendCommentMail(name: string, commentorName: string, invoiceNo: string, email: string): Promise<void> {
        if (NODE_ENV === "development")
            return
        const htmlBody = '<img style="width:250px;" src="cid:logo"><br/><br/>Hola ' + name + ' ¡Felicidades! Tu registro se ha completado con éxito.<br/><br/>Ya puedes disfrutar de THEGESTOR totalmente Gratis para gestionar tu negocio.<br/><br/>Con THEGESTOR tienes las funcionalidades que necesitas para gestionar tu negocio, presentar tus impuestos y tomar el control de tus gastos para ahorrar en tu factura fiscal:<br/><ul><li>Crear y organizar tus productos y servicios</li><li>Crear y enviar tus facturas personalizadas y hacer seguimiento del cobro</li><li>Subir tus gastos y tickets haciendo una foto con tu móvil</li><li>Conectar con tu banco para conciliar tus ingresos y gastos</li><li>Ver tus impuestos de IVA e IRPF en tiempo real</li><li>Guardar, consultar y descargar tus estados financieros desde cualquier lugar</li><li>Crear un usuario totalmente gratuito para que tu gestoría tenga acceso en tiempo real a todos tus ingresos y gastos.</li></ul><br/>Accede a THEGESTOR desde tu PC o desde el móvil descargando la aplicación.<br/><br/><a href="https://thegestor.app"><div style="display:inline-block;border-radius:8px;padding:10px 15px;background-color:#304799"><b style="color:white;font-size:14px;text-decoration:none;">Visita TheGestor</b></div></a><br/><br/>Recuerda que si necesitas ayuda para presentar impuestos o para gestionar tu contabilidad siempre tienes a tu disposición la ayuda de nuestros gestores contables y fiscales que te ayudarán desde el chat de la aplicación.<br/><br/>Un Saludo,<br/><br/>Lorenz Dos Ramos<br/>Customer Success TheGestor<br/><a href = "mailto:clientes@thegestor.com">clientes@thegestor.com</a><br/><a href="tel:+34633779821">+34 633 77 98 21</a>'
        const textBody = 'Hola ' + name + `

            ${commentorName} ha añadido un comentario para ${invoiceNo}. Por favor, compruebe y responda lo antes posible. 
            
            Muchas Gracias. 
            
            Un Saludo,
            TheGestor Team`
        let mailOptions = {
            from: FROM_EMAIL,
            to: email,
            subject: `${commentorName} ha añadido un comentario para ${invoiceNo}`,
            text: textBody,
            attachments: [{
                filename: 'logo.jpeg',
                path: process.cwd() + '/assets/logo.jpeg',
                cid: 'logo'
            }],
            html: htmlBody,

        };
        await this.transporter.sendMail(mailOptions)
    }

}

export default EmailService;
