const adminAppInit = require('../../admin-init-app');
const keys = require('../../../constants');

const db = adminAppInit.getInstance().firestore();

function getCustomer(customerEmail){
    return new Promise((resolve, reject) => {

        db.collection(keys.firestore.customers_collection_id)
        .where('email', '==', customerEmail)
        .get()
        .then(querySnapshot => {
            let customers = [];
            querySnapshot.forEach(documentSnapshot => {
                customers.push(documentSnapshot.data());
            });
            resolve(customers);
            return;
        })
        .catch(error => {
            error = {'error': 'Kesalahan terjadi saat memproses permintaan Anda',
                    'status': 400}
            reject(error);
            return;
        });
    });
}

module.exports = getCustomer;