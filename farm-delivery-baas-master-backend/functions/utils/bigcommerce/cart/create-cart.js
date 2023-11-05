const axios = require('axios');
const settings = require('../../settings');
const errorCodes = require('../../error-codes');

function createCart(payload){
    return new Promise((resolve, reject) => {
        config = {
            headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-Auth-Client': settings.X_Auth_Client,
                        'X-Auth-Token': settings.X_Auth_Token
                    }
        }

        console.log('payload -> ', payload);
        //Construct URL
        let url = 'https://' + settings.bigcommerce_api_host +':443'
                            + '/stores/' + settings.bigcommerce_store_hash 
                            + '/v3/carts';
        
        // Request data from Bigcommerce API & send response to the client accordingly
        axios.post(url, payload, config).then((response) => {
            resolve(response.data['data']);
            return;
        }).catch((error) => {
            console.log('error in creating cart -> ', JSON.stringify(error));
            if(error.response.status === 429){
                error = {'error': 'Server sedang sibuk. Silakan coba setelah beberapa saat',
                        'error_code': errorCodes['006'],
                        'status': 429};
            }
            else if(error.response.status === 422){
                error = {'error': error.response.data['title'].toString(),
                        'error_code': errorCodes['004'],
                        'status': 422};
            }
            else{
                error = {'error': 'Kesalahan terjadi saat memproses permintaan Anda!',
                        'status': 400};
            }
            reject(error);
        });
    });
}

module.exports = createCart;