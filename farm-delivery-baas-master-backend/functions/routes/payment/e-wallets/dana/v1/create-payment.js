const express = require('express');
const router = express.Router();
var moment = require('moment-timezone');

const settings = require('../../../../../utils/settings');
const keys = require('../../../../../utils/constants');
const errorCodes = require('../../../../../utils/error-codes');
const authenticateMiddleware = require('../../../../../middlewares/token-auth-middleware');
var getCheckout = require('../../../../../utils/bigcommerce/checkout/get-checkout');
var createOrder = require('../../../../../utils/bigcommerce/order/create-order');
var createPayment = require('../../../../../utils/xendit-payment-gateway/e-wallets/dana/create-payment');
var miscFuncs = require('../../../helpers/miscellaneous-functions');

router.post('/', authenticateMiddleware, function(req, res) {
    let checkoutId = req.body.checkout_id;
    getCheckout(checkoutId).then(checkoutObj => {
        createOrder(checkoutId).then(orderObj => {
            let grandTotal = miscFuncs.getGrandTotalCheckout(checkoutObj);
            let email = req.user.email;
            let payload = req.body.payment_info;
            // let timezone = req.body.timezone;

            let deliveryData = req.body.delivery_data;
            let deliveryArea =  deliveryData[keys.area];
            let deliveryDate = deliveryData[keys.date].toString().replace('-',' ');
            let deliveryTime = deliveryData[keys.time].toString().replace(':',' ');
            let currentDateTimeObj = moment();
            let expiryDateTime = currentDateTimeObj.add(2, 'hours');

            payload[keys.amount] = grandTotal;
            //The external ID format is "{OrderID}-{deliveryDateTimeFrom} {deliveryDateTimeTo}-{deliveryArea}"
            payload[keys.externalID] = orderObj[keys.id] + '-' + deliveryDate + ' ' + deliveryTime + '-' + deliveryArea 
                                        + '-' + email;
            payload[keys.expirationDate] = expiryDateTime;
            payload[keys.redirectURL] = settings.prod_site_base_url + '/order-successful?x=1&y='+checkoutId;
            payload[keys.callbackURL] = settings.localhost_callback_base_url + '/dana-paid';
            createPayment(payload).then(response => {
                console.log('DANA payment ' + payload[keys.externalID] + ' Created for '+ email + ' with checkout_id ' + checkoutId);
                return res.status(200).send(response);
            })
            .catch(error => {
                return res.status(400).send({'error': error,
                                            'error_code': errorCodes['012']});
            });
            return;
        })
        .catch(error => {
            if(error.response.status === 429){
                return res.status(429).send({'error': 'Server sedang sibuk. Silakan coba setelah beberapa saat',
                                            'error_code': errorCodes['006']});
            }
            else{
                return res.status(400).send({'error': 'Keranjang anda tidak valid!'})
            } 
        });
        return;
    })
    .catch(error => {
        if(error.response.status === 429){
            return res.status(429).send({'error': 'Server sedang sibuk. Silakan coba setelah beberapa saat',
                                        'error_code': errorCodes['006']});
        }
        else{
            return res.status(400).send({'error': 'Keranjang anda tidak valid!'})
        } 
    });
});

module.exports = router;