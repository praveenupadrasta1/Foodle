const express = require('express');
const admin_app_init = require('../../../utils/firebase_utils/admin-init-app');
const constants = require('../../../utils/constants');

const router = express.Router();

const db = admin_app_init.getInstance().firestore();

router.get('/', async function(req, res) {
    try{
        let response = [];
        let list_docs = await db.collection(constants.banners).listDocuments();
        for(let doc of list_docs){
            var banner_data = doc.get().then(document_snapshot => {
                let banner = document_snapshot.data();
                return banner;
              });
            response.push(banner_data);
        }
        return res.status(200).send({'banners' : await Promise.all(response)});
    }
    catch(error)
    {
        return res.status(400).send({'error' : 'Kesalahan terjadi saat memproses permintaan Anda!'});
    }
});

module.exports = router;