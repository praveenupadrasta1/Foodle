const adminAppInit = require('../../admin-init-app');
const keys = require('../../../constants');

const db = adminAppInit.getInstance().firestore();

function searchProductByBarcode(barcode){
    return new Promise((resolve, reject) => {

        db.collection(keys.firestore.products_collection_id)
        .where('upc', '==', barcode)
        .where('is_visible', '==', true)
        .get()
        .then(querySnapshot => {
            let products = [];
            querySnapshot.forEach(documentSnapshot => {
                products.push(documentSnapshot.data());
            });
            resolve(products);
            return;
        })
        .catch(error => {
            error = {'error': error.toString(),
                    'status': 400};
            reject(error);
            return;
        });
    });
}

module.exports = searchProductByBarcode;