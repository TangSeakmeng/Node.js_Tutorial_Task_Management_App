const api_key = process.env.SENDGRID_API_KEY
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(api_key)

// --------------------------------------------------------

// sgMail.send({
//     to: 'tangseakmeng44@gmail.com',
//     from: 'tangseakmeng01@gmail.com',
//     subject: 'sending email testing',
//     text: 'hello world'
// })

// --------------------------------------------------------

// const sendWelcomeEmail = (email, name) => {
//     sgMail.send({
//         to: email,
//         from: 'tangseakmeng01@gmail.com',
//         subject: 'Welcome',
//         text: `Thanks for joining us, ${name}!`
//     })
// }

// module.exports = {
//     sendWelcomeEmail
// }

