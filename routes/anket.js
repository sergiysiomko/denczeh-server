var express = require('express');
var router = express.Router();
var nodeMailer = require('nodemailer');

router.get('/',(req, res) => {
    res.render('anket')
})

router.post('/',(req, res) => {
    let data = req.body;
    //console.log(data)
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'sergiysiomko@gmail.com',
            pass: 'fsn72YISY'
        }
    });
    let mailOptions = {
        from: 'sergiysiomko@gmail.com', // sender address
        to: 'denysiukcz@gmail.com', // list of receivers//denysiukcz@gmail.com
        subject: 'Анкета', // Subject line
        html: `
        <b>Ім'я:</b> <br>${data.name}<br><br>
        <b>Побажання:</b><br>${data.description}<br><br>
        <b>Зручний час:</b> <br> ${data.time}<br><br>
        <b>Телефон: </b> <br>${data.tel}<br><br>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        }
        //console.log('Message %s sent: %s', info.messageId, info.response);
            res.redirect('/')
        });
})








module.exports = router;