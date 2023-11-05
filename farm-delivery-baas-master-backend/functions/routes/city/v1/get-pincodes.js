const express = require('express');
const admin_app_init = require('../../../utils/firebase_utils/admin-init-app');
const constants = require('../../../utils/constants');

const router = express.Router();

const db = admin_app_init.getInstance().firestore();

router.get('/:city/get_pincodes/', function(req, res){
    let doc_name = req.params.city.toLowerCase();
    db.collection(constants.city).doc(doc_name)
                        .get(constants.pincodes)
                        .then((doc_snapshot) => {
                                 return res.status(200).send({'pincodes' : doc_snapshot.get('pincodes')});
                            })
                        .catch((error) => {
                                return res.status(400).send({'error': error.toString()});
                            });
});

module.exports = router;