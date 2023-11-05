const express = require('express');
const router = express.Router();

const authenticateMiddleware = require('../../../middlewares/token-auth-middleware');
var getOrderProducts = require('../../../utils/bigcommerce/order/get-order-products');

router.post('/', authenticateMiddleware, function(req, res) {
    getOrderProducts(req.body.order_id).then(orderProducts => {
        return res.status(200).send({'response': orderProducts});
    }).catch(error => {
        return res.status(error.status).send(error);
    });
});

module.exports = router;