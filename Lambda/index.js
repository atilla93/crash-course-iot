exports.handler = (event, context, callback) => {


    var nodemailer = require('nodemailer');

    // create reusable transporter object using the default SMTP transport
    //var transporter = nodemailer.createTransport('smtp://atilla.topo07%40gmail.com:123456Abc@smtp.gmail.com:465');
    var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: '', // Your email id
        pass: '' // Your password
      }
    });

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: '"Nom" <mail>', // sender address
        to: '', // list of receivers
        subject: 'Surchauffe LAB', // Subject line
        text: 'Ceci est un message automatique envoyé afin de vous prévenir que la température du lab est supérieure à 30°!', // plaintext body
        html: '<b>Ceci est un message automatique envoyé afin de vous prévenir que la température du lab est supérieure à 30°!</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });


};
