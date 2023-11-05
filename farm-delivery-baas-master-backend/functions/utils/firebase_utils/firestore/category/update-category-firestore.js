const admin_app_init = require('../../admin-init-app');
const keys = require('../../../constants');

const db = admin_app_init.getInstance().firestore();

function updateCategory(categoryData){
    return new Promise((resolve, reject) => {
        db.collection(keys.firestore.categories_collection_id)
            .doc(categoryData.id.toString())
            .update(categoryData)
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

module.exports = updateCategory;