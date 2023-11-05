module.exports = {
    getGrandTotalCheckout: function(checkoutObj){
        const keys = require('../../../utils/constants');
        return checkoutObj[keys.grand_total];
    }
}