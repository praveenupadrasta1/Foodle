const express = require('express');
const admin_app_init = require('../../../utils/firebase_utils/admin-init-app');
const keys = require('../../../utils/constants');

const router = express.Router();

const db = admin_app_init.getInstance().firestore();

router.get('/get_cities/', async function(req, res){
    try{
        let response = [];
        let include_field = ["city","next_n_days_accept_orders", "same_day_delivery", "timezone",
        "delivery_timings","order_accept_before_n_hours","country_code","province"];
        let list_docs = await db.collection(keys.city).listDocuments();
        for(let doc of list_docs){
            let temp_data = doc.get().then(doc_snapshot => {
                                        if(doc_snapshot.exists){
                                            if(doc_snapshot.get(keys.valid)){
                                                var doc_dict = {};
                                                include_field.forEach(field => {
                                                    doc_dict[field] = doc_snapshot.get(field);
                                                });
                                            }
                                        }
                                        return doc_dict;
                                    })
                                    .catch((error) => {
                                        return err;
                                    });
            response.push(temp_data);
        }
        return res.status(200).send({'cities' : await Promise.all(response)});
    }
    catch(error){
        return res.status(400).send({'error': 'Kesalahan terjadi saat memproses permintaan Anda!'});
    }
});

module.exports = router;