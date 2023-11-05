const axios = require('axios');
const settings = require('../../settings');
const errorCodes = require('../../error-codes');

function getProduct(productID){
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
        let getProductUrl = 'https://' + settings.bigcommerce_api_host +':443'
                            + '/stores/' + settings.bigcommerce_store_hash 
                            + '/v3/catalog/products/' + productID
                            + '?include=' + include.join(',')
                            + '&include_fields=' + productIncludeFields.join(',');
        
        // Request data from Bigcommerce API
        axios.get(getProductUrl, config).then((productResponse) => {
            // products_data = productsResponse.data['data'];
            resolve(productResponse);
            return;
        }).catch((error)=>{
            if(error.response.status === 429){
                err = {'error': error,
                'error_code': errorCodes['006']}
                reject(err);
                return;
            }
            else{
                err = {'error': error.toString()};
                reject(err);
                return;
            }
        });
    })
}

module.exports = getProduct;