const axios = require('axios');
const settings = require('../../settings');
const errorCodes = require('../../error-codes');

function getCategories(){
    return new Promise((resolve, reject) => {
        let category_include_fields = ["id","name","image_url","description","is_visible"]
    
        //Construct query params
        config = {
            params: { 
                        include_fields: category_include_fields.join(','),
                        is_visible: true
                    },
            headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-Auth-Client': settings.X_Auth_Client,
                        'X-Auth-Token': settings.X_Auth_Token
                    }
        }

        //Construct URL
        let url = 'https://' + settings.bigcommerce_api_host +':443'
                            + '/stores/' + settings.bigcommerce_store_hash 
                            + '/v3/catalog/categories';
        
        // Request data from Bigcommerce API & send response to the client accordingly
        axios.get(url, config).then((response) => {
            resolve(response);
            return;
        }).catch((error)=>{
            if(error.response.status === 429){
                err = {'error': error,
                       'error_code': errorCodes['006'],
                       'status_code': 429};
                reject(err);
                return;
            }
            else{
                err = {'error': error.toString(),
                       'status_code': 400};
                reject(err);
                return;
            }
        });
    });
}

module.exports = getCategories;