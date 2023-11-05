const express = require('express');
const router = express.Router();
const authenticateMiddleware = require('../../../middlewares/token-auth-middleware');

const keys = require('../../../utils/constants');
const errorCodes = require('../../../utils/error-codes');

var applyShippingAddressToCheckoutID = require('../../../utils/bigcommerce/shipping-billing-address/apply-shipping-address-checkout');
var applyShippingOptionsToCheckout = require('../../../utils/bigcommerce/shipping-billing-address/apply-shipping-options-checkout');
var applyBillingAddressToCheckoutID = require('../../../utils/bigcommerce/shipping-billing-address/apply-billing-address-checkout');

router.post('/', authenticateMiddleware, function(req, res) {

    let deliveryData = req.body[keys.delivery_data];
    let cityData = req.body[keys.city_data];
    let lineItems = req.body[keys.line_items];
    let shippingAddress = req.body[keys.shipping_address];
    shippingAddress[keys.email] = req.user.email;
    let cartID = req.body[keys.id];

    applyShippingAddressToCheckoutID(lineItems, shippingAddress, cartID)
        .then(shippingAddressResponse => {
            applyShippingOptionsToCheckout(shippingAddressResponse, 
                deliveryData[keys.date], 
                deliveryData[keys.area],
                cityData)
                .then(shippingOptionResponse => {
                    applyBillingAddressToCheckoutID(shippingAddress, shippingOptionResponse[keys.id])
                    .then(billingAddressResponse => {
                        return res.status(200).send({'response': billingAddressResponse});
                    })
                    .catch(error =>{
                        return res.status(error.status).send(error);
                    });
                    return;
                })
                .catch(error => {
                    return res.status(error.status).send(error);
                });
            return;
        })
        .catch(error => {
            return res.status(error.status).send(error);
        });
});

module.exports = router;