const express = require('express');
const router = express.Router();
const authenticateMiddleware = require('../../../middlewares/token-auth-middleware');
const adminAppInit = require('../../../utils/firebase_utils/admin-init-app');
const getCustomer = require('../../../utils/firebase_utils/firestore/customer/get-customer-firestore');
const updateCustomerInBigcommerce = require('../../../utils/bigcommerce/customer/updateCustomer');

const admin = adminAppInit.getInstance();

router.put('/update_user/', authenticateMiddleware, async function(req, res) {
    try{
        var old_user_displayName = null;
        var bigcommerceUserId = null;
        await getCustomer(req.user.email)
                    .then((users) => {
                        if(users.length){
                            let user = users[0];
                            bigcommerceUserId = user.id;
                        }
                        else{
                            return res.status(400).send({'error': 'Kesalahan terjadi saat memproses permintaan Anda!'});
                        }
                        return;
                    })
                    .catch((error) => {
                        console.log('error getting user ', error);
                        return res.status(400).send({'error': error});
                    });

        // Update user in Firebase
        var userData = req.body;
        var updated_customer_firebase = await admin.auth().updateUser(req.user.uid, {
                                            email: userData.email,
                                            phoneNumber: userData.phone_number,
                                            displayName: userData.first_name + ' ' + userData.last_name,
                                            photoURL: userData.photo_url
                                        })
                                        .then((userRecord) => {
                                            // See the UserRecord reference doc for the contents of userRecord.
                                            console.log('Successfully updated user in firebase', userRecord.toJSON());
                                            return userRecord;
                                        })
                                        .catch((error) => {
                                            console.log('Error updating user in firebase :', error);
                                            return res.status(400).send({'error': 'Tidak dapat memperbarui profil Anda!'});
                                        });
        
        // Update user in Bigcommerce
        await updateCustomerInBigcommerce(bigcommerceUserId, userData)
                    .then(updateCustomerBigcommerce => {
                        console.log('customer updated in bigcommerce', updateCustomerBigcommerce)
                        return res.status(200).send({'user': updateCustomerBigcommerce});
                    })
                    .catch(error => {
                        console.log('error updating user in bigcommerce : ', error)
                        return res.status(400).send({'error': 'Tidak dapat memperbarui profil Anda!'});
                    });
    }
    catch(error)
    {
        console.log('error: ', error)
        return res.status(400).send({'error': error});
    }
});

module.exports = router;