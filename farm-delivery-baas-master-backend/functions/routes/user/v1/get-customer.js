const express = require('express');
const router = express.Router();
const authenticateMiddleware = require('../../../middlewares/token-auth-middleware');
const adminAppInit = require('../../../utils/firebase_utils/admin-init-app');

const admin = adminAppInit.getInstance();

router.get('/get_user/', authenticateMiddleware, function(req, res) {
    admin.auth().getUser(req.user.uid)
                .then((userRecord) => {
                    // See the user_record reference doc for the contents of user_record.
                    return res.status(200).send({'user': userRecord});
                })
                .catch((error) => {
                    return res.status(400).send({'error': 'Kesalahan terjadi saat memproses permintaan Anda'});
                });
});

module.exports = router;