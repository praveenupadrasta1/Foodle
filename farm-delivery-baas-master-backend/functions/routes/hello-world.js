const express = require('express');
const router = express.Router();
const authenticateMiddleware = require('../middlewares/token-auth-middleware');

router.use(authenticateMiddleware);

router.get('/', function (req, res) {
    return res.status(200).send({"Message": "Hello World!!"});
});

module.exports = router;