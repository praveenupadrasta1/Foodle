// const express = require('express');
// const router = express.Router();

// const admin_app_init = require('../../utils/firebase_utils/admin-init-app');
// const axios = require('axios');
// const settings = require('../../../utils/settings');
// const keys = require('../../../utils/constants');
// const errorCodes = require('../../../utils/error-codes');
// const authenticateCUDBigCommerceWebhookToken = require('../../../middlewares/auth-CUD-bigcommerce-webhook-token-middleware');

// router.post('/', authenticateCUDBigCommerceWebhookToken, function(req, res) {
//     let payload = {
//         [keys.scope]: "store/category/*",
//         [keys.destination]: req.body.destination,
//         [keys.headers]: {
//           [keys.x_callback_token]: settings.bigcommerce_callback_token
//         }
//     }
    
//     config = {
//         headers: {
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json',
//                     'X-Auth-Client': settings.X_Auth_Client,
//                     'X-Auth-Token': settings.X_Auth_Token
//                 }
//     }

//     //Construct URL
//     let url = 'https://' + settings.bigcommerce_api_host +':443'
//                             + '/stores/' + settings.bigcommerce_store_hash 
//                             + '/v2/hooks';

//     axios.post(url, payload, config).then(response => {
//         const db = admin_app_init.getInstance().firestore();
//         db.collection(keys.col_bigcommerce_webhooks).doc(keys.doc_category).set({
//             name: "Los Angeles",
//             state: "CA",
//             country: "USA"
//         })
//         .then(function() {
//             console.log("Document successfully written!");
//         })
//         .catch(function(error) {
//             console.error("Error writing document: ", error);
//         });
//         return;
//     })
//     .catch(error => {
//         return res.status(400).send({'error':'Problem in creating webhook'});
//     });
// });

// module.exports = router;