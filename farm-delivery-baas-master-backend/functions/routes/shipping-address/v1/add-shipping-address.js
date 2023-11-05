const express = require('express');
const router = express.Router();
const axios = require('axios');

const settings = require('../../../utils/settings');
const keys = require('../../../utils/constants');
const authenticateMiddleware = require('../../../middlewares/token-auth-middleware');
const errorCodes = require('../../../utils/error-codes');
const getCustomer = require('../../../utils/firebase_utils/firestore/customer/get-customer-firestore');

router.post('/', authenticateMiddleware, (req, res) => {

    getCustomer(req.user.email).then((users) => {
        if(users.length){
            let user = users[0];
            let shippingAddress = req.body[keys.shipping_address];
            shippingAddress[keys.customer_id] = user.id;
            let payload = [];
            payload.push(shippingAddress);
        
            config = {
                headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'X-Auth-Client': settings.X_Auth_Client,
                            'X-Auth-Token': settings.X_Auth_Token
                        }
            }
        
            //Construct URL
            let addShippingAddressUrl = 'https://' + settings.bigcommerce_api_host +':443'
            + '/stores/' + settings.bigcommerce_store_hash 
            + '/v3/customers/addresses';
        
            axios.post(addShippingAddressUrl, payload, config)
                .then((response) => {
                    data = response.data['data'];
                    return res.status(200).send({'shipping_addresses': data});
                })
                .catch((error) => {
                    if(error.response.status === 429){
                        return res.status(429).send({'error': 'Server sedang sibuk. Silakan coba setelah beberapa saat',
                        'error_code': errorCodes['006']});
                    }
                    else{
                        return res.status(400).send({'error': 'Tidak dapat menambahkan alamat pengiriman'});
                    }
                });
        }
        else{
            return res.status(400).send({'error': 'Kesalahan terjadi saat memproses permintaan Anda!'});
        }
        return;
    }).catch(error => {
        return res.status(error.status).send(error);
    });
});

module.exports = router;