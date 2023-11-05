// const admin_app_init = require('../../admin-init-app');
// const keys = require('../../../constants');

// const db = admin_app_init.getInstance().firestore();

// function deleteVariant(productID, variantID){
//     return new Promise(function(resolve, reject) {
//         db.collection(keys.firestore.products_collection_id)
//             .doc(productID.toString())
//             .update('variants', FieldValue.arrayRemove())
//             .then((res) => {
//                 console.log('res -> ', res);
//                 resolve(res);
//                 return;
//             })
//             .catch(error => {
//                 console.log('error -> ', error);
//                 reject(error);
//                 return;
//             });
//     });
// }

// module.exports = deleteVariant;