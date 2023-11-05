const axios = require('axios');
const settings = require('../../settings');
const keys = require('../../constants');

function applyShippingAddressToCheckoutID(lineItems, shippingAddress, checkoutID){
    return new Promise((resolve, reject) => {
        let payload = [
           {
                [keys.shipping_address] : shippingAddress,
                [keys.line_items]: lineItems
           }
        ]

        config = {
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
                            + '/v3/checkouts/' + checkoutID + '/consignments?include=consignments.available_shipping_options';
        
        // Request data from Bigcommerce API & send response to the client accordingly
        axios.post(url, payload, config).then((response) => {
            resolve(response.data['data']);
            return;
        }).catch((error)=>{
            error = {'error': error.response.data['title'],
                    'status': error.response.status};
            reject(error);
        });
    });
}

// function getLineItems(cart){
//     let lineItems = [];
//     for(let item of cart[keys.line_items][keys.physical_items]){
//         let itemData = {
//             [keys.item_id]: item.id,
//             [keys.quantity]: item.quantity
//         }
//         lineItems.push(itemData);
//     }
//     return lineItems;
// }

module.exports = applyShippingAddressToCheckoutID;