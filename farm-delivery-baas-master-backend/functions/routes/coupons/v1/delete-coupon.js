const express = require('express');
const router = express.Router();

const authenticateMiddleware = require('../../../middlewares/token-auth-middleware');

var deleteCoupon = require('../../../utils/bigcommerce/coupon/delete-coupon-checkout');

router.delete('/', authenticateMiddleware, function(req, res) {
    let checkoutID = req.body.checkout_id;
    let couponCode = req.body.coupon_code;

    deleteCoupon(checkoutID, couponCode).then(couponResponse => {
        return res.status(200).send({'response': couponResponse});
    })
    .catch(error => {
        return res.status(error.status).send(error);
    });
});

module.exports = router;