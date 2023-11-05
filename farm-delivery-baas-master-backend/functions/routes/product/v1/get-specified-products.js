const express = require('express');
const router = express.Router();

const getProductsSubset = require('../helpers/get-products-subset');

router.post('/', function(req, res) {

    getProductsSubset(req.body.products_id).then(products => {
        return res.status(200).send({'products_data': products});
    }).catch(error => {
        return res.status(error.status).send(error);
    });
});

module.exports = router;