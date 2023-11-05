const axios = require('axios');
const settings = require('../../settings');

function deleteCustomerShippingAddresses(shippingAddressID){
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
        let delete_shipping_address_url = 'https://' + settings.bigcommerce_api_host +':443'
        + '/stores/' + settings.bigcommerce_store_hash 
        + '/v3/customers/addresses?id:in='+shippingAddressID;
    
        axios.delete(delete_shipping_address_url, config)
            .then((response) => {
                data = {'message': 'Address deleted successfully!'};
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
                    error = {'error': 'Tidak dapat menghapus alamat pengiriman',
                            'status': 400};
                }
                reject(error);
            });
    });
}

module.exports = deleteCustomerShippingAddresses;