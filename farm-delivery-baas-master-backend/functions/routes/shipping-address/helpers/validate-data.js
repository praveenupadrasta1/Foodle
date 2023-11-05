const keys = require('../../../utils/constants');
const errorCodes = require('../../../utils/error-codes');

module.exports = {
    isShippingAddressIDExist: function(shippingAddressID, shippingAddresses){
        for(let shippingAddress of shippingAddresses){
            if(shippingAddress[keys.id] === shippingAddressID){
                return true;
            }
        }
        return false;
    }
}