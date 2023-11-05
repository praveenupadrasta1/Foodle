const https = require('https');
const settings = require('../../settings');

function updateCustomerInBigcommerce(customerId, userData) {
    return new Promise((resolve, reject) => {

        var user = JSON.stringify({'email': userData.email,
                                    'first_name': userData.first_name,
                                    'last_name': userData.last_name,
                                    'phone': userData.phone_number});

        const options = {
            host : settings.bigcommerce_api_host,
            path : '/stores/' + settings.bigcommerce_store_hash + '/v2/customers/' + customerId,
            port: settings.bigcommerce_port,
            method : 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Auth-Client': settings.X_Auth_Client,
                'X-Auth-Token': settings.X_Auth_Token
            }
        }
        var body = '';
        var response_status_code;
        var req = https.request(options, (res) => {
                    response_status_code = res.statusCode;
                    res.on('data', (data) => {
                        body += data;
                    });
                    res.on('end', () => {
                        body = JSON.parse(body);
                        resolve(body);
                    });
                });
        
            req.on('error', (error) => {
                reject(error); 
            });

            req.write(user);
            req.end();
    });
}

module.exports = updateCustomerInBigcommerce;