import * as SparkPost from "sparkpost";
import { createTransport, Transporter } from "nodemailer";
import { verifyEmailTemplate } from "./template";
const client: SparkPost = new SparkPost(process.env.SPARKPOST_API_KEY);

export const sendEmailSparkPost = async (recipient: string, link: string, userName: string) => {
    try {
        const response = await client.transmissions.send({
            options: {
                sandbox: true,
            },
            content: {
                from: "testing@sparkpostbox.com",
                subject: "Email confirmation",
                html: verifyEmailTemplate(link, userName),
            },
            recipients: [{ address: recipient }],
        });

        console.log(`Email sent succesfully: ${response}`);
    } catch(err) {
        console.log(`Error sending email: ${err}`);
    }
};

export const sendEmailSMTP = async (recipient: string, subject: string, html: string) => {
    const options: any = {
        port: Number.parseInt(process.env.SMTP_PORT as string, 10),
        host: process.env.SMTP_HOST,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
        requireTLS: true,
    };

    const envelope: any = {
        from: process.env.SMTP_USER,
        to: recipient,
        subject,
        html,
    };

    const transporter: Transporter = createTransport(options);
    const response: any = await transporter.sendMail(envelope);
    console.log(response);
};
