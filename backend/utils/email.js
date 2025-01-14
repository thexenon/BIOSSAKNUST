// const nodemailer = require('nodemailer');
// const pug = require('pug');
// const htmlToText = require('html-to-text');

// module.exports = class Email {
//   constructor(user, url) {
//     this.to = user.email;
//     this.firstName = user.name.split(' ')[0];
//     this.url = url;
//     this.from = `Wins Family Chapel <${process.env.EMAIL_FROM}>`;
//   }

//   newTransport() {
//     if (process.env.NODE_ENV === 'production') {
//       // Use Gmail in production
//       return nodemailer.createTransport({
//         service: 'Gmail',
//         auth: {
//           user: process.env.GMAIL_USERNAME,
//           pass: process.env.GMAIL_PASSWORD,
//         },
//       });
//     }

//     return nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: process.env.EMAIL_PORT,
//       auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });
//   }

//   // Send the actual email
//   async send(template, subject) {
//     // 1) Render HTML based on a pug template
//     const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
//       firstName: this.firstName,
//       url: this.url,
//       subject,
//     });

//     // 2) Define email options
//     const mailOptions = {
//       from: this.from,
//       to: this.to,
//       subject,
//       html,
//       text: htmlToText.htmlToText(html),
//     };

//     // 3) Create a transport and send email
//     await this.newTransport().sendMail(mailOptions);
//   }

//   async sendWelcome() {
//     await this.send('welcome', 'Welcome to the Wins Family!');
//   }

//   async sendPasswordReset() {
//     await this.send(
//       'passwordReset',
//       'Your password reset token (valid for only 10 minutes)',
//     );
//   }
// };

// // const nodemailer = require('nodemailer');

// // const sendEmail = async options => {
// //   // 1) Tranporter
// //   const transporter = nodemailer.createTransport({
// //     // service: 'Gmail',
// //     host: process.env.EMAIL_HOST,
// //     port: process.env.EMAIL_PORT,
// //     auth: {
// //       user: process.env.EMAIL_USERNAME,
// //       pass: process.env.EMAIL_PASSWORD
// //     }
// //   });

// //   // 2) Email options
// //   const mailOptions = {
// //     from: 'Derek Donkor <donkorekderek@gmail.com>',
// //     to: options.emal,
// //     subject: options.subject,
// //     text: options.text
// //   };

// //   // 3) Send Email
// //   await transporter.sendMail(mailOptions);
// // };

// // module.exports = sendEmail;
