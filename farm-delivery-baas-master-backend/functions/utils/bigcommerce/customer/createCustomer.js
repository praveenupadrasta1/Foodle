const axios = require('axios');
const settings = require('../../settings');

function createCustomerInBigcommerce(email, firstName, lastName) {
    return new Promise((resolve, reject) => {

        let payload = [{
                        'email': email,
                        'first_name': firstName,
                        'last_name': lastName
                        }]
        
        config = {
            headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-Auth-Client': settings.X_Auth_Client,
                        'X-Auth-Token': settings.X_Auth_Token
                    }
        }

        let createCustomerUrl =  'https://' + settings.bigcommerce_api_host +':443'
                            + '/stores/' + settings.bigcommerce_store_hash 
                            + '/v3/customers';
        
        axios.post(createCustomerUrl, payload, config).then(response => {
            resolve(response.data['data']);
            return;
        })
        .catch(error => {
            reject(error);
        });
    });
}

module.exports = createCustomerInBigcommerce;