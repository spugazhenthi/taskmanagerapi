const sendgrid = require('@sendgrid/mail')

sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

sendgrid.send({
    from:'pugazhgym123@gmail.com',
    to : 'pugazhgym123@gmail.com',
    subject : 'Task App',
    text:'This is from Node JS course'
})

const sendWelcomeEmail = async (email,name) => {
   sendgrid.send({
       from:email,
       to: email,
       subject: 'Thanks for joinging with us',
       text : `Welcome to the app, ${name}. Let me know how you get along with app.`
   })
}

const sendCancelEmail = (email,name) =>{
    sendgrid.send({
        from:email,
        to:email,
        subject:'UnSubscribe',
        text : `Hi ${name} , Please let me know why you have cancelled. Will try to improve on it`
    })
} 

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}