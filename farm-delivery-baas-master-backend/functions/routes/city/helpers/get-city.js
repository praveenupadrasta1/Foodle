const keys = require('../../../utils/constants');
const admin_app_init = require('../../../utils/firebase_utils/admin-init-app');
const db = admin_app_init.getInstance().firestore();

function getCity(cityName){
    return new Promise(function(resolve, reject) {
        db.collection(keys.city)
            .doc(cityName.toString().toLowerCase())
            .get()
            .then(doc => {
                if (doc.exists && doc.data()[keys.valid]) {
                    resolve(doc.data());
                } 
                else {
                    reject(Error(JSON.stringify({'error': 'Tidak ada area pengiriman seperti itu!'})));
                }
                return;
            })
            .catch(err => {
                reject(err);
            });
    });
}

module.exports = getCity;