const express = require('express');
const router = express.Router();

const getCategories = require('../../../utils/firebase_utils/firestore/category/get-categories-firestore');
const getAllFeaturedProducts = require('../../../utils/firebase_utils/firestore/product/get-all-featured-products');
const helperFns = require('../../product/helpers/helper-functions');
router.get('/', function(req, res) {
    getCategories().then(categoryResponse => {
        getAllFeaturedProducts().then((featuredProductsResponse) => {
            let productIncludeFields = ['id','name','description','meta_description', 'order_quantity_minimum',
                    'order_quantity_maximum', 'categories', 'images', 'custom_fields'];

            let variantIncludeFields = ['option_values','price', 'sale_price', 'retail_price', 
                    'inventory_level', 'inventory_warning_level', 
                    'product_id', 'id', 'purchasing_disabled'];
            featuredProductsResponse = helperFns.pruneProducts(featuredProductsResponse, productIncludeFields, variantIncludeFields);
            return res.status(200).send({'data': categoryResponse,
                                        'featured_products': featuredProductsResponse});
        }).catch(error => {
            return res.status(error.status).send(error);
        });
        return;
    }).catch(error => {
        return res.status(error.status).send(error);
    });
});

module.exports = router;