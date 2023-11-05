const express = require('express');
const adminAppInit = require('../utils/firebase_utils/admin-init-app');
const constants = require('../utils/constants');

const router = express.Router();

const db = adminAppInit.getInstance().firestore();

router.get('/get_current_version/', function(req, res){
    db.doc(constants.version + '/' + constants.new_version).get()
        .then((snapshot) => {
            let force_update = snapshot.get(constants.force_update);
            let version = snapshot.get(constants.version_field);
            return res.status(200).send({'version' : version, 
                                'force_update' : force_update});
        })
        .catch((error) => {
            console.log('error fetching version document: ', error);
            return res.status(400).send({'error': 'Kesalahan terjadi saat memproses permintaan Anda'});
        });
});

module.exports = router;