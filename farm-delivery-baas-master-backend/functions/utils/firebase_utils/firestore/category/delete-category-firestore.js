const admin_app_init = require('../../admin-init-app');
const keys = require('../../../constants');

const db = admin_app_init.getInstance().firestore();

function deleteCategory(categoryID){
    return new Promise((resolve, reject) => {
        db.collection(keys.firestore.categories_collection_id)
            .doc(categoryID.toString())
            .delete()
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

module.exports = deleteCategory;