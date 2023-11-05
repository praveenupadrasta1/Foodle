const express = require('express');
const router = express.Router();

const getSpecifiedProducts = require('../../../utils/firebase_utils/firestore/product/get-specified-products-firestore');
const helperFns = require('../helpers/helper-functions');

router.post('/', function(req, res) {
    let productsID = req.body.products_id;
    let variantIncludeFields = ["sale_price","inventory_level","purchasing_disabled","id"];

    getSpecifiedProducts(productsID).then(response => {
        let variants = helperFns.getVariantsOfProducts(response, variantIncludeFields);
        return res.status(200).send({'variants_data': variants});
    })
    .catch(error => {
        return res.status(error.status).send(error);
    });

    // let headers = {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json',
    //     'X-Auth-Client': settings.X_Auth_Client,
    //     'X-Auth-Token': settings.X_Auth_Token
    // }

    // //Construct URL
    // let get_variants_of_products = 'https://' + settings.bigcommerce_api_host +':443'
    // + '/stores/' + settings.bigcommerce_store_hash 
    // + '/v3/catalog/variants?product_id:in=' + products_id.join(',') 
    //                             + '&include_fields='+variants_include_fields.join(',');
    // let variants_data = null;
    // axios.get(get_variants_of_products, { headers: headers })
    //     .then((variants_response) => {
    //         variants_data = variants_response.data['data'];
    //         return res.status(200).send({'variants_data': variants_data});
    //     })
    //     .catch((error) => {
    //         if(error.response.status === 429){
    //             return res.status(429).send({'error': error,
    //                                     'error_code': errorCodes['006']});
    //         }
    //         else{
    //             return res.status(400).send({'error': error.toString()});
    //         }
    //     });
});

module.exports = router;