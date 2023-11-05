const settings = require('../../settings');
const errorCodes = require('../../error-codes');

function createInvoice(payload){
    return new Promise((resolve, reject) => {
        var xendit = require('xendit-node');
        const x = new xendit({ secretKey: settings.xendit_secret_key });
        const {Invoice} = x;
        const invoiceSpecificOptions = {};
        const invoice = new Invoice(invoiceSpecificOptions);
        invoice.createInvoice(payload).then(response => {
            resolve(response);
            return;
        }).catch(error => {
            console.log('error xendit create invoice ', error);
            error = {'error': 'Kesalahan terjadi saat memproses permintaan Anda!',
                    'error_code': errorCodes['012'],
                    'status': 400}
            reject(error);
        })
    });
}

module.exports =  createInvoice;