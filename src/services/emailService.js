const nodemailer = require("nodemailer");

const sendEmail = async (email) => {
  //   let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secture: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
      //   user: testAccount.user,
      //   pass: testAccount.password,
    },
  });

  let info = await transporter.sendMail({
    from: "DisneyAPI Staff",
    to: email,
    subject: "Welcome to DisneyAPI",
    html: `<h1><b>Welcome to the disney API!!</b></h1>\n
            this is an alkemy challenge , you can learn more 
            <a href="https://alkemy.org">here</a>.\n
            `,
  });

  transporter.verify().then(() => {
    // console.log("Email Service ready");
  });

  console.log("Message sent: %s", info.messageId);
};

module.exports = sendEmail;
