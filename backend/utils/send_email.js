const node_mail = require('nodemailer');
const path = require('path');
const nehbs = require('nodemailer-express-handlebars');
require('dotenv').config();

const send_email = async (options) => {
    const transporter = node_mail.createTransport({
        host: process.env.SMPT_HOST,
        port: 465, // process.env.SMPT_PORT,
        secure: false, // true for 465, false for other ports
        service: process.env.SMPT_SERVICE,
        auth: {
            user: process.env.SMPT_MAIL, // generated ethereal user
            pass: process.env.SMPT_PASSWORD, // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const  handle_bars_options = {
        viewEngine: {
            extName: ".html",
            partialsDir: path.resolve("./views/"),
            defaultLayout: "confirm-email",
        },
        viewPath: path.resolve("./views/"),
        extName: ".html",
    };

    transporter.use("compiler", nehbs(handle_bars_options))

    const mail_options = {
        from: options.from,
        to: options.to,
        subject: options.subject,
        attachments: options.attachments,
        template: options.template,
        context: options.context,
        html: options.html,
    };

    await transporter.sendMail(mail_options);
};

module.exports = send_email;