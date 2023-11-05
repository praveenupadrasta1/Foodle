const adminAppInit = require('../firebase_utils/admin-init-app');

const admin = adminAppInit.getInstance();

// Delete customer created in firebase
var deleteCustomerCreatedInFirebase = async function(user_uid){
    admin.auth().deleteUser(user_uid)
                                    .then(() => {
                                        console.log('Successfully deleted user');
                                        return {'status' : 200}
                                    })
                                    .catch((error) => {
                                        console.log('Error deleting user:', error);
                                        return {'status' : 400}
                                    });
}

module.exports = deleteCustomerCreatedInFirebase;