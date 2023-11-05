const axios = require('axios');
const settings = require('../../settings');

function getCustomerShippingAddresses(customerBigCommerceID){
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
        let get_shipping_addresses_url = 'https://' + settings.bigcommerce_api_host +':443'
        + '/stores/' + settings.bigcommerce_store_hash 
        + '/v3/customers/addresses?customer_id:in='+customerBigCommerceID;
    
        axios.get(get_shipping_addresses_url, config)
            .then((response) => {
                data = response.data['data'];
                resolve(data);
                return;
            })
            .catch((error) => {
                if(error.response.status === 429){
                    error = {'error': 'Server sedang sibuk. Silakan coba setelah beberapa saat',
                            'error_code': errorCodes['006'],
                            'status': 429};
                }
                else{
                    error = {'error': 'Tidak bisa mendapatkan alamat pengiriman Anda!',
                            'status': 400};
                }
                reject(error);
            });
    });
}

module.exports = getCustomerShippingAddresses;