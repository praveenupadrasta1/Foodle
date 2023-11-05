const functions = require('firebase-functions');

const createCustomerInBigCommerce = require('../../../utils/bigcommerce/customer/createCustomer');
const createCustomer = require('../../../utils/firebase_utils/firestore/customer/create-customer-firestore');
var getCustomer = require('../../../utils/firebase_utils/firestore/customer/get-customer-firestore');
const adminAppInit = require('../../../utils/firebase_utils/admin-init-app');
const admin = adminAppInit.getInstance();

let createProfileInBigCommerce = functions.auth.user().onCreate((userRecord, context) => {
    let firstName = '';
    let lastName = '';
    let email = userRecord.email;
    let firebaseUID = userRecord.uid;
    getCustomer(email).then((userData) => {
        if(userData.length === 0){
            admin.auth().getUser(firebaseUID).then((user) => {
                let temp = user.displayName.split(' ');
                firstName = temp[0];
                if(temp.length > 1){
                    lastName = temp[1];
                }
                else{
                    lastName = firstName;
                }
                return createCustomerInBigCommerce(email, firstName, lastName).then((userProfileBigCommerce) => {
                    console.log('created user profile in BigCommerce ' + JSON.stringify(userProfileBigCommerce));
                    return userProfileBigCommerce[0];
                }).then((bigCommerceCustomerProfile) => {
                    createCustomer(bigCommerceCustomerProfile).then((createCustomerInFirestoreResponse) => {
                        console.log('created user profile in Firestore ' + JSON.stringify(createCustomerInFirestoreResponse));
                        return createCustomerInFirestoreResponse;
                    }).catch((error) => {
                        console.log('error creating user in firestore ', JSON.stringify(error));
                        return error;
                    });
                    return bigCommerceCustomerProfile;
                }).catch(error => {
                    console.log('error creating user in bigcommerce -> ', JSON.stringify(error));
                    return error;
                });
            })
            .catch((error) => {
                console.log('error getting user in admin.auth', error);
                return error;
            });
            console.log('User Not created');
            let msg = {'msg': 'User Not created'};
            return msg;
        }
        console.log('User already exists');
        let msg = {'msg': 'User already exists'};
        return msg;
    }).catch((error) => {
        console.log('error getting user ', error);
        return error;
    });
});

module.exports = createProfileInBigCommerce;