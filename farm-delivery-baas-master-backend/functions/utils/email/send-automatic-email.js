const nodemailer = require('nodemailer');
const settings = require('../settings');

function sendAutomaticEmail(message){
    return new Promise((resolve, reject) => {
        let transport = nodemailer.createTransport(settings.email_settings);

        transport.sendMail(message, function(err, info) {
            if (err) {
                reject(err);
            //   console.log(err)
            } else {
            //   console.log(info);
              resolve(info);
              return;
            }
        });
    });
}

module.exports = sendAutomaticEmail;