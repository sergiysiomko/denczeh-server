var express = require('express');
var router = express.Router();
var nodeMailer = require('nodemailer');

router.get('/',(req, res) => {
    res.render('anket')
})

router.post('/',(req, res) => {
    let data = req.body;

    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'denjobtech@gmail.com',
            pass: 'fsn72YISY'
        }
    });
    let mailOptions = {
        from: 'denjobtech@gmail.com', // sender address
        to: 'zstu42@gmail.com', // list of receivers
        subject: 'Анкета', // Subject line
        text: `
        Ім'я: ${data.name}
        Зручний час: ${data.time}
        Телефон: ${data.tel}` // plain text body
        //html: '<b>NodeJS Email Tutorial</b>' // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            next(error)
        }
        //console.log('Message %s sent: %s', info.messageId, info.response);
            res.redirect('/')
        });
})








module.exports = router;