const express = require('express');
const router = express.Router();

const authenticateMiddleware = require('../../../middlewares/token-auth-middleware');

var getCheckout = require('../../../utils/bigcommerce/checkout/get-checkout');
var validateData = require('../helpers/validate-data');
var applyCouponToCheckout = require('../../../utils/bigcommerce/coupon/apply-coupon-checkout');

router.post('/', authenticateMiddleware, function(req, res) {
    let checkoutID = req.body.checkout_id;
    let couponCode = req.body.coupon_code;

    getCheckout(checkoutID).then(checkoutObj => {
        if(!validateData.isCouponAlreadyApplied(checkoutObj)){
            applyCouponToCheckout(checkoutID, couponCode).then(couponResponse => {
                return res.status(200).send({'response': couponResponse});
            })
            .catch(error => {
                return res.status(error.status).send(error);
            });
        }
        else{
            return res.status(400).send({'error': 'Hanya satu voucher yang dapat diterapkan ke checkout!'});
        }
        return;
    })
    .catch(error => {
        return res.status(error.status).send(error);
    });
});

module.exports = router;