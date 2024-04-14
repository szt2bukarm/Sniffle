const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');

function generateHTML(name, code) {
  return `
  <head>
  <style>
  body{
    padding: 0;
    margin: 0;
    font-family: Arial;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #1111116e;
}

.logo{
    display: block;
    width: 300px;
    margin: 0 auto;
}

.email{
    margin-top: 30px;
    width: 500px;
    background-color: #fff;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 0 30px rgba(0,0,0,0.2);
}

@media screen and (max-width: 600px) {
    .email{
        width: 100%;
        border-radius: 0;
        box-shadow: none;
    }

    body{
        background-color: #fff;
    }
}

.code{
    text-align: center;
    font-size: 48px;
    font-weight: 600;
    letter-spacing: 3px;
    margin-bottom: 50px;
}
  </style>
</head>
<body>
  
  <div class="email">
      <img class="logo" src="https://i.ibb.co/MDQgvtZ/logo.png" alt="">
      <h1>Hello!</h1>
      <p>This email was sent to you because your email was used to sign up for an account on Sniffle.</p>

      <div class="email-code">
          <p>Your account confirmation code is (valid for 10 minutes):</p>
          <p class="code">${code}</p>
      </div>

      <p>If you did not sign up for an account on Sniffle, please ignore this email.</p>
  </div>


</body>
  `;
}

module.exports = class Email {
  constructor(user, content) {
    this.to = user;
    this.from = `Sniffle <${process.env.EMAIL_FROM}>`;
    this.content = content;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  // Send the actual email
  async send(template, subject) {
    let html;
    if (template == 'code') html = generateHTML(this.to,this.content)
    

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.compile(html)
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendCode() {
    await this.send('code', 'Confirm your Sniffle account.');
  }
};
