const axios = require('axios');
const settings = require('../../settings');
const errorCodes = require('../../error-codes');

function deleteCoupon(checkoutId, couponCode){
    return new Promise((resolve, reject) => {
        config = {
            headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-Auth-Client': settings.X_Auth_Client,
                        'X-Auth-Token': settings.X_Auth_Token
                    }
        }

        let deleteCouponCodeUrl =  'https://' + settings.bigcommerce_api_host +':443'
                            + '/stores/' + settings.bigcommerce_store_hash 
                            + '/v3/checkouts/' + checkoutId + '/coupons/' + couponCode;
        
        axios.delete(deleteCouponCodeUrl, config).then(response => {
            resolve(response.data['data']);
            return;
        })
        .catch(error => {
            if(error.response.status === 429){
                error = {'error': 'Server sedang sibuk. Silakan coba setelah beberapa saat',
                        'error_code': errorCodes['006'],
                        'status': 429};
            }
            else{
                error = {'error': 'Tidak bisa menghapus voucher!',
                        'status': 400};
            }
            reject(error);
        });
    });
}

module.exports = deleteCoupon;