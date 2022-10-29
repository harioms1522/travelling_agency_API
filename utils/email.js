const nodemailer = require("nodemailer")

const sendEmail = async options => {
    // 1) create a transporter
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 2525,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    // 2) define options
    const mailOptions = {
        from: "Hariom Sharma <admin@admin.com>",
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html
    }

    // 3) send the mail with nodemailer
    await transport.sendMail(mailOptions)
}

module.exports = sendEmail