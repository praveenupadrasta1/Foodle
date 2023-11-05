const admin_app_init = require('../../../../utils/firebase_utils/admin-init-app');
const keys = require('../../../../utils/constants');

const db = admin_app_init.getInstance().firestore();
module.exports = {
    isPromotionStoreExist: function(couponCode){
        return new Promise(function(resolve, reject) {
            db.doc(keys.firestore.promotion_stores_collection_id + '/' + couponCode)
            .get().then(promotionStoresSnapshot => {
                if(promotionStoresSnapshot.exists){
                    resolve(promotionStoresSnapshot.data());
                    return;
                }
                else{
                    resolve(null);
                    return;
                }
            }).catch(error => {
                console.log('No Store is linked for this particular promotion/coupon code', error);
                reject(error);
                return;
            })
        });
    },

    getTotalEarningsNTotalNetOrdersValue: function(orders){
        let totEarnings = 0;
        let totNetOrdersValue = 0;
        // console.log('entries ', Object.entries(orders));
        for(let [key, value] of Object.entries(orders)){
            totEarnings += value['earnings'];
            totNetOrdersValue += value['net_order_value'];
        }
        // console.log('totEarnings ', totEarnings);
        // console.log('totNetOrdersValue ', totNetOrdersValue);
        return {
            'tot_earnings': totEarnings,
            'tot_net_orders_value': totNetOrdersValue
        }
    }
}
