const adminAppInit = require('../../admin-init-app');
const keys = require('../../../constants');

const db = adminAppInit.getInstance().firestore();

function getCategoryProducts(categoryID){
    return new Promise((resolve, reject) => {

        db.collection(keys.firestore.products_collection_id)
        .where('categories', 'array-contains', categoryID)
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
            error = {'error': 'Kesalahan terjadi saat memproses permintaan Anda!',
                    'status': 400};
            reject(error);
            return;
        });
    });
}

module.exports = getCategoryProducts;