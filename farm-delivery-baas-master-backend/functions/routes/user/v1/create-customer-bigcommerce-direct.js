const express = require('express');
const router = express.Router();

const createCustomerInBigCommerce = require('../../../utils/bigcommerce/customer/createCustomer');
const createCustomer = require('../../../utils/firebase_utils/firestore/customer/create-customer-firestore');
var getCustomer = require('../../../utils/firebase_utils/firestore/customer/get-customer-firestore');
const authenticateMiddleware = require('../../../middlewares/token-auth-middleware');
const adminAppInit = require('../../../utils/firebase_utils/admin-init-app');
const admin = adminAppInit.getInstance();

router.get('/', authenticateMiddleware, function(req, res) {
    let firstName = '';
    let lastName = '';
    let email = req.user.email;
    let firebaseUID = req.user.uid;
    admin.auth().getUser(firebaseUID).then((user) => {
        getCustomer(email).then((userData) => {
            if(userData.length === 0){
                let temp = user.displayName.split(' ');
                firstName = temp[0];
                if(temp.length > 1){
                    lastName = temp[1];
                }
                else{
                    lastName = firstName;
                }
                createCustomerInBigCommerce(email, firstName, lastName).then((userProfileBigCommerce) => {
                    console.log('created user profile in BigCommerce ' + JSON.stringify(userProfileBigCommerce));
                    return userProfileBigCommerce[0];
                }).then((bigCommerceCustomerProfile) => {
                    createCustomer(bigCommerceCustomerProfile).then((createCustomerInFirestoreResponse) => {
                        console.log('created user profile in Firestore ' + JSON.stringify(createCustomerInFirestoreResponse));
                        return res.status(200).send({'response': 'Success'});
                    }).catch((error) => {
                        console.log('error creating user in firestore ', JSON.stringify(error));
                        return res.status(200).send({'error': 'Kesalahan terjadi saat memproses permintaan Anda'});
                    });
                    return bigCommerceCustomerProfile;
                })
                .catch((error) => {
                    return res.status(200).send({'error': 'Kesalahan terjadi saat memproses permintaan Anda'});
                });
                return;
            }
            return res.status(200).send({'response': 'Success'});
        }).catch((error) => {
            console.log('error getting user ', error);
            return res.status(200).send({'error': 'Kesalahan terjadi saat memproses permintaan Anda'});
        });
        return;
    }).catch(error => {
        console.log('error getting user ', error);
        return res.status(200).send({'error': 'Kesalahan terjadi saat memproses permintaan Anda'});
    });
});

module.exports = router;