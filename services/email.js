
async function sendEmail(to, subject, html){
    const nodemiler = require('nodemailer');
    const transporter = nodemiler.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });
    
    await transporter.sendMail({
        from: process.env.MAIL_FROM_ADRESS,
        to: to,
        subject: subject,
        html: html
    });
}

module.exports =  {
    sendEmail
}