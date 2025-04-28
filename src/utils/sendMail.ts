import nodemailer from 'nodemailer';

export const sendMail = async (from: string, to: string, subject: string, text: string) => {
    const transporter = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE,
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        },
        host: process.env.MAIL_HOST,
    });

    const mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, info)=> {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}