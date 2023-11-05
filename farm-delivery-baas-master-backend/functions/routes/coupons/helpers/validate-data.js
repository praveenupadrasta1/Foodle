const keys = require('../../../utils/constants');

module.exports = {
    isCouponAlreadyApplied: function(checkoutObj){
        if(checkoutObj[keys.coupons].length){
            return true;
        }
        else{
            return false;
        }
    }
}