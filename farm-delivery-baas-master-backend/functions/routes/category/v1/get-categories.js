const express = require('express');
const router = express.Router();

const getCategories = require('../../../utils/firebase_utils/firestore/category/get-categories-firestore');

router.get('/', function(req, res) {
    
    getCategories().then(categoryResponse => {
            return res.status(200).send({'data': categoryResponse});
    }).catch(error => {
        return res.status(error.status).send(error);
    });
});

module.exports = router;