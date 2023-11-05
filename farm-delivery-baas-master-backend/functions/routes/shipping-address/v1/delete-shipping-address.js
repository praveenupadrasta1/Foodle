const express = require('express');
const router = express.Router();

const keys = require('../../../utils/constants');
const getCustomerShippingAddresses = require('../../../utils/bigcommerce/shipping-billing-address/get-customer-shipping-addresses');
const validate = require('../helpers/validate-data');
const authenticateMiddleware = require('../../../middlewares/token-auth-middleware');
const deleteCustomerShippingAddress = require('../../../utils/bigcommerce/shipping-billing-address/delete-customer-shipping-address');
const errorCodes = require('../../../utils/error-codes');
const getCustomer = require('../../../utils/firebase_utils/firestore/customer/get-customer-firestore');

router.delete('/', authenticateMiddleware, (req, res) => {

    getCustomer(req.user.email).then((users) => {
        if(users.length){
            let user = users[0];
            getCustomerShippingAddresses(user.id).then(data => {
                let shippingAddressID = req.body[keys.id];
                if(validate.isShippingAddressIDExist(shippingAddressID, data)){
                    deleteCustomerShippingAddress(shippingAddressID).then(response => {
                        return res.status(204).send(response);
                    }).catch(error => {
                        return res.status(error.status).send(error);
                    });
                }
                else{
                    return res.status(400).send({'error': 'Tidak ada alamat pengiriman seperti itu!'})
                }
                return;
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