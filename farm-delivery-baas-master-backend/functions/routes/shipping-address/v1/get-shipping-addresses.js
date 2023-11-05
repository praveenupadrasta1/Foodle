const express = require('express');
const router = express.Router();

const getCustomerShippingAddresses = require('../../../utils/bigcommerce/shipping-billing-address/get-customer-shipping-addresses');
const authenticateMiddleware = require('../../../middlewares/token-auth-middleware');
const errorCodes = require('../../../utils/error-codes');
const getCustomer = require('../../../utils/firebase_utils/firestore/customer/get-customer-firestore');

router.get('/', authenticateMiddleware, (req, res) => {

    getCustomer(req.user.email).then((users) => {
        if(users.length){
            let user = users[0];
            getCustomerShippingAddresses(user.id).then(data => {
                return res.status(200).send({'shipping_addresses': data});
            })
            .catch(error => {
                return res.status(error.status).send(error);
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