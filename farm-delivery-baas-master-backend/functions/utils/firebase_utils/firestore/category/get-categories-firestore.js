const admin_app_init = require('../../admin-init-app');
const keys = require('../../../constants');

const db = admin_app_init.getInstance().firestore();

function getCategories(){
    return new Promise((resolve, reject) => {
        db.collection(keys.firestore.categories_collection_id)
        .get()
        .then((categoriesQuerySnapshot) => {
            let categories = [];
            categoriesQuerySnapshot.forEach(categoryDocumentSnapshot => {
                categories.push(categoryDocumentSnapshot.data());
            });
            resolve(categories);
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

module.exports = getCategories;