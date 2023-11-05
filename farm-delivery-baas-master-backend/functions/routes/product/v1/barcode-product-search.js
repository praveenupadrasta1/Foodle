const express = require('express');
const router = express.Router();

const searchProductByBarcode = require('../../../utils/firebase_utils/firestore/product/barcode-product-search');
const helperFns = require('../helpers/helper-functions');

router.post('/', function(req, res) {
    
    let productIncludeFields = ['id','name','description','meta_description', 'order_quantity_minimum',
                                'order_quantity_maximum', 'categories', 'images', 'custom_fields'];

    let variantIncludeFields = ['option_values','price', 'sale_price', 'retail_price', 
                                'inventory_level', 'inventory_warning_level', 
                                'product_id', 'id', 'purchasing_disabled'];

    searchProductByBarcode(req.body.upc).then(product => {
        let productData = helperFns.pruneProducts(product, productIncludeFields, variantIncludeFields);
        return res.status(200).send({'products_data': productData});
    })
    .catch(error => {
        return res.status(error.status).send(error);
    });
});

module.exports = router;