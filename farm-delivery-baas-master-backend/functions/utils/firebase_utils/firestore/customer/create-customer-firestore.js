const admin_app_init = require('../../admin-init-app');
const keys = require('../../../constants');

const db = admin_app_init.getInstance().firestore();

function createCustomer(customerData){
    return new Promise((resolve, reject) => {
        db.collection(keys.firestore.customers_collection_id)
        .doc(customerData.email)
        .create(customerData)
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

module.exports = createCustomer;