const express = require('express');
const router = express.Router();

const axios = require('axios');
const settings = require('../../utils/settings');
const errorCodes = require('../../utils/error-codes');

function getCategoryProducts(categoryID){
    return new Promise((resolve, reject) => {
        let productIncludeFields = ["id","name","description","meta_description", 
            "order_quantity_minimum", "order_quantity_maximum", "categories", "upc", "search_keywords", "is_visible", "is_featured"];
            
        let include = ["images","variants","custom_fields"];

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
        let getProductsOfCategoryUrl = 'https://' + settings.bigcommerce_api_host +':443'
                            + '/stores/' + settings.bigcommerce_store_hash 
                            + '/v3/catalog/products'
                            + '?include=' + include.join(',')
                            + '&categories:in=' + categoryID
                            + '&include_fields=' + productIncludeFields.join(',');

        // Request data from Bigcommerce API & send response to the client accordingly
        axios.get(getProductsOfCategoryUrl, config).then((productsResponse) => {
            resolve(productsResponse);
            return;
        }).catch((error)=>{
            if(error.response.status === 429){
                err = {'error': error,
                'error_code': errorCodes['006']};
                reject(err);
                return;
            }
            else{
                err = {'error': error.toString()}
                reject(err);
                return;
            }
        });
    });
}

module.exports = getCategoryProducts;