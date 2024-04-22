import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: true,
  },
});

const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log("Email transporter is ready!");
  } catch (error) {
    console.error("Email transporter is not ready!");
  }
};
verifyTransporter();

/**
 *  Send mail
 * @param {string} to
 * @param {string} content
 */
export const sendMail = async (content) => {
  const mail = await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: "aydinhalil980@gmail.com",
    subject: "Would you date me logger",
    text: content,
  });

  console.log(mail);
};
