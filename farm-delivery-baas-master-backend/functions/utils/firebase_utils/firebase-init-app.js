var firebase = require('firebase');
const settings = require('../settings');

// Singleton Class to create only one instance of Firebase Instance
var FirebaseAppInit = (function () {
    var instance;
 
    // Create Firebase app instance
    function createInstance() {

        // Initialize Firebase
        return firebase.initializeApp(settings.firebase_config);
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

module.exports = FirebaseAppInit;