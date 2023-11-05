const express = require('express');
const router = express.Router();

const getCategoryProducts = require('../../../utils/firebase_utils/firestore/product/get-category-products-firestore');
const helperFns = require('../helpers/helper-functions');

router.post('/', function(req, res) {
    
    let productIncludeFields = ['id','name','description','meta_description', 'order_quantity_minimum',
                                'order_quantity_maximum', 'categories', 'images', 'custom_fields'];

    let variantIncludeFields = ['option_values','price', 'sale_price', 'retail_price', 
                                'inventory_level', 'inventory_warning_level', 
                                'product_id', 'id', 'purchasing_disabled'];

    getCategoryProducts(req.body.category).then(categoryProducts => {
        let products = helperFns.pruneProducts(categoryProducts, productIncludeFields, variantIncludeFields);
        return res.status(200).send({'products_data': products});
    })
    .catch(error => {
        return res.status(error.status).send(error);
    });
});

module.exports = router;