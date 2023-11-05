const express = require('express');
const router = express.Router();

const axios = require('axios');
const settings = require('../../../utils/settings');
const errorCodes = require('../../../utils/error-codes');
const helperFns = require('../helpers/helper-functions');

router.post('/', function(req, res) {
    let keyword = req.body.keyword;

    let productIncludeFields = ['id','name','description','meta_description', 'order_quantity_minimum',
                                'order_quantity_maximum', 'categories'];
    
    let include = ['images', 'custom_fields', 'variants'];                                

    let variantIncludeFields = ['option_values','price', 'sale_price', 'retail_price', 
                                'inventory_level', 'inventory_warning_level', 
                                'product_id', 'id', 'purchasing_disabled'];

    let headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Auth-Client': settings.X_Auth_Client,
        'X-Auth-Token': settings.X_Auth_Token
    }
    //Construct query params
    config = {
        headers: headers
    }

    //Construct URL
    let getProductsUrl = 'https://' + settings.bigcommerce_api_host +':443'
                         + '/stores/' + settings.bigcommerce_store_hash 
                         + '/v3/catalog/products?is_visible=true'
                         + '&keyword=' + keyword
                         + '&include_fields=' + productIncludeFields.join(',')
                         + '&include=' + include.join(',');
    
    let productsData = null;

    // Request data from Bigcommerce API & send response to the client accordingly
    axios.get(getProductsUrl, config).then((productsResponse) => {
        productsData = helperFns.pruneProductVariantsFields(productsResponse.data['data'], variantIncludeFields);
        return res.status(200).send({'products_data': productsData});
    }).catch((error)=>{
        if(error.response.status === 429){
            return res.status(429).send({'error': 'Server sedang sibuk. Silakan coba setelah beberapa saat',
            'error_code': errorCodes['006']});
        }
        else{
            return res.status(400).send({'error': 'Kesalahan terjadi saat memproses permintaan Anda'});
        }
    });
});

module.exports = router;