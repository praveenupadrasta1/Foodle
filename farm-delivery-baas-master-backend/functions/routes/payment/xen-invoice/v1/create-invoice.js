const express = require('express');
const router = express.Router();

const settings = require('../../../../utils/settings');
const keys = require('../../../../utils/constants');
const errorCodes = require('../../../../utils/error-codes');
const authenticateMiddleware = require('../../../../middlewares/token-auth-middleware');
var getCheckout = require('../../../../utils/bigcommerce/checkout/get-checkout');
var createOrder = require('../../../../utils/bigcommerce/order/create-order');
var createInvoice = require('../../../../utils/xendit-payment-gateway/xen-invoice/create-invoice');
var miscFuncs = require('../../helpers/miscellaneous-functions');

router.post('/', authenticateMiddleware, function(req, res) {
    let checkoutId = req.body.checkout_id;
    getCheckout(checkoutId).then(checkoutObj => {
        createOrder(checkoutId).then(orderObj => {
            let grandTotal = miscFuncs.getGrandTotalCheckout(checkoutObj);
            let email = req.user.email;
            let payload = req.body.payment_info;

            let deliveryData = req.body.delivery_data;
            let deliveryArea =  deliveryData[keys.area];
            let length = Math.ceil(deliveryArea.length/2);
            let deliveryAreaCode = deliveryArea[0] + deliveryArea[length] + deliveryArea[deliveryArea.length-1];
            
            payload[keys.payerEmail] = email;
            payload[keys.amount] = grandTotal;
            //The external ID format is "INV/{OrderID}/{user-email}/{delivery-area-code}"
            payload[keys.externalID] = 'INV/' + orderObj[keys.id] + '/' + email + '/' + deliveryAreaCode;
            payload[keys.paymentMethods] =  settings.xendit_avail_invoice_payment_methods;
            payload[keys.shouldSendEmail] = true;
            payload[keys.invoiceDuration] = 60 * 60 * 2; // 2 Hrs
            payload[keys.currency] = 'IDR';
            payload[keys.successRedirectURL] = settings.prod_site_base_url+'/order-successful?x=1&y='+checkoutId;
            payload[keys.failureRedirectURL] = settings.prod_site_base_url+'/order-successful?x=0&y='+checkoutId;
            createInvoice(payload).then(response => {
                console.log('Invoice ' + payload[keys.externalID] + ' Created for '+ email + ' with checkout_id ' + checkoutId);
                return res.status(200).send(response);
            })
            .catch(error => {
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