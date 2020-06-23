const sendgridAPIKey = process.env.SENDGRID_API_KEY

try{
    const sgMail = require('@sendgrid/mail')
}catch(e){
    console.log(e.message)    
}




sgMail.setApiKey(sendgridAPIKey)


const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'joaquin.ayala.c@gmail.com',
        subject: 'Gracias por unirte!',
        text: `Bienvenido a la app, ${name}. Esperamos que te sirva para organizar tu día!`
    })
}

const sendGoodbyeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'joaquin.ayala.c@gmail.com',
        subject: 'Lamentamos que hayas cancelado',
        text: `Lamentamos que hayas tenido que irte, ${name}. Qué podríamos haber hecho mejor? Un saludo, Task App.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
}