const express = require('express');
const router = express.Router();

const authenticateMiddleware = require('../../../middlewares/token-auth-middleware');
var getCustomerOrders = require('../../../utils/bigcommerce/order/get-customer-orders');
var helperFns = require('../helpers/helper-functions');

router.get('/', authenticateMiddleware, function(req, res) {
    let customerEmail = req.user.email;

    let includeFields = ["id", "date_created", "date_modified", "status_id", "status", "subtotal_inc_tax", "shipping_cost_inc_tax",
                        "total_inc_tax", "items_total", "payment_method", "refunded_amount", "staff_notes", "customer_message",
                        "discount_amount", "coupon_discount", "billing_address"];
    getCustomerOrders(customerEmail).then(customerOrders => {
        customerOrders = helperFns.pruneOrderFields(customerOrders, includeFields);
        return res.status(200).send({'response': customerOrders});
    }).catch(error => {
        return res.status(error.status).send(error);
    });
});

module.exports = router;