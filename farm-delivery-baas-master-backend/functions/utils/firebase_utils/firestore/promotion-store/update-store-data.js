const admin_app_init = require('../../admin-init-app');
const keys = require('../../../constants');

const db = admin_app_init.getInstance().firestore();

function updatePromotionStore(promotionStoreData){
    return new Promise((resolve, reject) => {
        db.collection(keys.firestore.promotion_stores_collection_id)
            .doc(promotionStoreData.coupon_code)
            .update(promotionStoreData)
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

module.exports = updatePromotionStore;