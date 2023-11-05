const axios = require('axios');
const settings = require('../../settings');

function applyBillingAddressToCheckoutID(shippingAddress, checkoutID){
    return new Promise((resolve, reject) => {
        let payload = shippingAddress;

        config = {
            headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-Auth-Client': settings.X_Auth_Client,
                        'X-Auth-Token': settings.X_Auth_Token
                    }
        }

        //Construct URL
        let url = 'https://' + settings.bigcommerce_api_host +':443'
                            + '/stores/' + settings.bigcommerce_store_hash 
                            + '/v3/checkouts/' + checkoutID + '/billing-address';
        
        // Request data from Bigcommerce API & send response to the client accordingly
        axios.post(url, payload, config).then((response) => {
            resolve(response.data['data']);
            return;
        }).catch((error)=>{
            error = {
                'error': error.response.data['title'],
                'status': error.response.status,
            }
            reject(error);
            return;
        });
    });
}

module.exports = applyBillingAddressToCheckoutID;