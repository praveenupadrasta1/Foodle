const settings = require('../../../settings');

function createPayment(payload){
    return new Promise((resolve, reject) => {
        var xendit = require('xendit-node');
        const x = new xendit({ secretKey: settings.xendit_secret_key });
        const { EWallet } = x;
        const ewalletSpecificOptions = {};
        const ewallet =  new EWallet(ewalletSpecificOptions);
        payload[keys.ewalletType] = EWallet.Type.OVO;
        ewallet.createPayment(payload).then(response => {
            resolve(response);
            return;
        }).catch(error => {
            reject(error);
        })
    });
}

module.exports =  createPayment;