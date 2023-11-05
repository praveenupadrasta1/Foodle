const admin_app_init = require('../../admin-init-app');
const keys = require('../../../constants');

const db = admin_app_init.getInstance().firestore();

function updateProduct(productData){
    return new Promise((resolve, reject) => {
        db.collection(keys.firestore.products_collection_id)
        .doc(productData.id.toString())
        .update(productData)
        .then((res) => {
            resolve(res);
            return;
        })
        .catch(error => {
            reject(error);
            return;
        });
    });
}

module.exports = updateProduct;