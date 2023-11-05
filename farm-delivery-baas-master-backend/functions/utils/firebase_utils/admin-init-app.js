var admin = require('firebase-admin');
var serviceAccount = require('../../utils/farm-delivery-indo-firebase-adminsdk-ebvd2-b078419f66.json');
const settings = require('../settings');

// Singleton Class to create only one instance of admin Instance
var AdminAppInit = (function () {
    var instance;
 
    // Create Admin app instance
    function createInstance() {
        return admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: settings.firebase_datbase_url
          });
    }
 
    return {
        getInstance: function () {
            if (!instance) {
                // Create Instance if Instance doesn't exists
                instance = createInstance();
            }
            // Returns Instance if instance already exists
            return instance;
        }
    };
})();

module.exports = AdminAppInit;