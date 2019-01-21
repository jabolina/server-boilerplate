import * as SparkPost from "sparkpost";
import { verifyEmailTemplate } from "./template";
const client: SparkPost = new SparkPost(process.env.SPARKPOST_API_KEY);

export const sendEmail = async (recipient: string, link: string, userName: string) => {
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
