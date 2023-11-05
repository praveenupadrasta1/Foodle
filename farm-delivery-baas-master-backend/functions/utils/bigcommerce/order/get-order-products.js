const axios = require('axios');
const settings = require('../../settings');

function getOrderProducts(orderID){
    return new Promise((resolve, reject) => {
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
                            + '/v2/orders/'+orderID+'/products?limit=50';
        
        // Request data from Bigcommerce API & send response to the client accordingly
        axios.get(url, config).then((response) => {
            resolve(response.data);
            return;
        }).catch((error)=>{
            if(err.response.status === 500){
                error = {'error': 'Kesalahan terjadi saat memproses permintaan Anda',
                        'status': 500};
            }
            else if(err.response.status === 429){
                error = {'error': 'Server sedang sibuk. Silakan coba setelah beberapa saat',
                        'error_code': errorCodes['006'],
                        'status': 429};
            }
            else{
                error = {'error': 'Tidak bisa mendapatkan pesanan Anda. Silakan coba lagi setelah beberapa saat!',
                        'status': 400};
            }
            reject(error);
        });
    });
}

module.exports = getOrderProducts;