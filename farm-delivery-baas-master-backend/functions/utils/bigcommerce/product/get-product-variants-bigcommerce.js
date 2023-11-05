const axios = require('axios');
const settings = require('../../settings');

function getProductVariantsFromBigCommerce(productsID){
    return new Promise((resolve, reject) => {
        let variantsIncludeFields = ["id",
                                    "inventory_level", 
                                    "option_values",
                                    "sale_price",
                                    "product_id",
                                    "purchasing_disabled"];

        let headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Auth-Client': settings.X_Auth_Client,
            'X-Auth-Token': settings.X_Auth_Token
        }
    
        //Construct URL
        let getVariantsOfProducts = 'https://' + settings.bigcommerce_api_host +':443'
        + '/stores/' + settings.bigcommerce_store_hash 
        + '/v3/catalog/variants?product_id:in=' + productsID.join(',') 
                                    + '&include_fields='+variantsIncludeFields.join(',');
        let variantsData = null;
        axios.get(getVariantsOfProducts, { headers: headers })
            .then((variantsResponse) => {
                variantsData = variantsResponse.data['data'];
                resolve(variantsData);
                return;
            })
            .catch((error) => {
                reject(error);
            });
    });
}

module.exports = getProductVariantsFromBigCommerce;