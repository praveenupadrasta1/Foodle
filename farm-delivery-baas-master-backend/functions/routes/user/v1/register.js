// const express = require('express');
// const router = express.Router();

// const firebaseAppInit = require('../../utils/firebase_utils/firebase-init-app');
// var createCustomerInBigcommerce = require('../../utils/bigcommerce/customer/createCustomer');
// var deleteUserCreatedInFirebase = require('../../utils/firebase_utils/deleteCustomer');
// const adminAppInit = require('../../utils/firebase_utils/admin-init-app');

// const firebase = firebaseAppInit.getInstance();
// const admin = adminAppInit.getInstance();

// router.post('/', async function(req, res){
//     var user_uid = null;
//     try
//     {
//         var email = req.body.email;
//         var password = req.body.password;
//         var err = null;

//         // Register Customer In firebase
//         var user = await firebase.auth().createUserWithEmailAndPassword(email, password)
//                                 .catch(function(error) {
//                                     err = error;
//                                     console.log('error registering user in firebase: ', error);
//                                     return res.status(400).send({'error': error.message});
//                                 });
//         if(err === null){
//             let first_name = req.body.first_name;
//             let last_name = req.body.last_name;
//             let name = null;

//             // Create Customer in Bigcommerce
//             await createCustomerInBigcommerce(email, first_name, last_name)
//                     .then(customer_bigcommerce => {
//                             user_uid = user['user']['uid'];
//                             // Append the customer ID from Bigcommerce to the name because it's
//                             // the simple and easy method to map the customer between Firebase & Bigcommerce.
//                             // Also this will help to update the customer easily in Bigcommerce, rather
//                             // than getting all customers data just to update one customer.
//                             name = first_name + ' ' + last_name + ' ' + customer_bigcommerce['data'][0]['id'];
//                             return;
//                     })
//                     .catch(error => {
//                         // Delete customer in firebase since Creating user in Bigcommerce throwed an error
//                         deleteUserCreatedInFirebase(user_uid);
//                         console.log('error creating customer in bigcommerce: ', error);
//                         return res.status(400).send({'error': error});
//                     });

//             // Update user with the name provided in firebase
//             await admin.auth().updateUser(user_uid, {
//                                             displayName: name
//                                         })
//                             .then(function(updated_user_data){
//                                 return res.status(200).send({'user': updated_user_data,
//                                                             'access_token': user['user']['xa'],
//                                                             'refresh_token': user['user']['refreshToken']});
//                             })
//                             .catch(function(error) {
//                                 console.log('error updating user in firebase: ', error);
//                                 return res.status(400).send({'error': error.message});
//                             });

//         }
//     }
//     catch(error)
//     {
//         // If user already created user_uid will not be null so need to delete the user 
//         // created in firebase because of the exception caused.
//         console.log('error: ', error);
//         if(user_uid !== null){
//             await deleteUserCreatedInFirebase(user_uid);
//         }
//         return res.status(400).send({'error': error});
//     }
// });

// module.exports = router;