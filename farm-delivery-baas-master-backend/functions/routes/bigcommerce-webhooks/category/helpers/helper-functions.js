const admin_app_init = require('../../../../utils/firebase_utils/admin-init-app');
const keys = require('../../../../utils/constants');

const db = admin_app_init.getInstance().firestore();
module.exports = {
    isCategoriesCollectionExists: function(){
        return new Promise(function(resolve, reject) {
            db.listCollections().then(collections => {
                for (let collection of collections) {
                    if(collection.id.toString().toLowerCase() === 'categories'){
                        resolve(true);
                        return;
                    }
                }
                resolve(false);
                return;
            }).catch(error => {
                console.log('Error getting collections', error);
                reject(error);
                return;
            });
        });
    },

    isCategoryExists: function(categoryID){
        return new Promise(function(resolve, reject) {
            db.doc(keys.firestore.categories_collection_id + '/' + categoryID)
            .get().then(docSnapshot => {
                if(docSnapshot.exists){
                    resolve(true);
                    return;
                }
                else{
                    resolve(false);
                    return;
                }
            }).catch(error => {
                console.log('Error getting categories', error);
                reject(error);
                return;
            })
        });
    }
}


