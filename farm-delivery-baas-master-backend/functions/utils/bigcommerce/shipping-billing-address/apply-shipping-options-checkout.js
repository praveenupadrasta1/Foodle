const axios = require('axios');
var moment = require('moment-timezone');

const settings = require('../../settings');
const keys = require('../../constants');
const errorCodes = require('../../error-codes');

function applyShippingOptionsToCheckout(checkoutObj, selectedDeliveryDate, deliveryArea, cityData){
    return new Promise((resolve, reject) => {
        let checkoutID = checkoutObj[keys.id];
        let consignments = checkoutObj[keys.consignments];
        let availShippingOpts = consignments[0][keys.available_shipping_options];
        let shippingOptID = null;
        let freeShippingOpt = getFreeShippingOption(availShippingOpts);
        if(freeShippingOpt){
            shippingOptID = freeShippingOpt[keys.id];
        }
        else if(isSameDayDelivery(selectedDeliveryDate, cityData)){
            let sameDayShippingOptID = getSameDayDeliveryShippingOption(availShippingOpts, 
                                                                            deliveryArea);
            if(sameDayShippingOptID){
                shippingOptID = sameDayShippingOptID[keys.id];
            }
        }
        else{
            let nextDayShippingOptID = getNextDayDeliveryShippingOption(availShippingOpts, 
                                                                        deliveryArea);
            if(nextDayShippingOptID){
                shippingOptID = nextDayShippingOptID[keys.id];
            }
        }
        if(shippingOptID){
            config = {
                headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'X-Auth-Client': settings.X_Auth_Client,
                            'X-Auth-Token': settings.X_Auth_Token
                        }
            }
            
            let payload = {
                [keys.shipping_option_id]: shippingOptID
            }

            //Construct URL
            let url = 'https://' + settings.bigcommerce_api_host +':443'
                                + '/stores/' + settings.bigcommerce_store_hash 
                                + '/v3/checkouts/' + checkoutID + '/consignments/' + consignments[0][keys.id];
            
            // Request data from Bigcommerce API & send response to the client accordingly
            axios.put(url, payload, config).then((response) => {
                resolve(response.data['data']);
                return;
            }).catch((error)=>{
                error = {'error': error.response.data['title'],
                            'status': error.response.status};
                reject(error);
            });
        }
        else{
            let error = {'error': 'Tidak ada opsi Pengiriman yang tersedia untuk tujuan ini!',
            'error_code': errorCodes['005'],
            'status': 400};
            reject(error);
        }
    });
}

function getFreeShippingOption(availShippingOpts){
    for(let shippingOpt of availShippingOpts){
        if(shippingOpt[keys.type] === 'freeshipping' || shippingOpt[keys.description].includes('Free Shipping')){
            return shippingOpt;
        }       
    }
    return null;
}

function getSameDayDeliveryShippingOption(availShippingOpts, deliveryArea){
    for(let shippingOpt of availShippingOpts){
        let description = shippingOpt[keys.description].toString().toLowerCase();
        if(shippingOpt[keys.type] === 'shipping_flatrate' && 
        description.includes('same') && 
        description.includes(deliveryArea.toString().toLowerCase())){
            return shippingOpt;
        }       
    }
    return null;
}

function getNextDayDeliveryShippingOption(availShippingOpts, deliveryArea){
    for(let shippingOpt of availShippingOpts){
        let description = shippingOpt[keys.description].toString().toLowerCase();
        if(shippingOpt[keys.type] === 'shipping_flatrate' && 
        description.includes('next') && 
        description.includes(deliveryArea.toString().toLowerCase())){
            return shippingOpt;
        }       
    }
    return null;
}

function isSameDayDelivery(selectedDeliveryDate, cityData){
    let timezone = cityData[keys.timezone];
    let sameDayDelivery = cityData[keys.same_day_delivery];

    let currentDateObj = moment().tz(timezone);
    let currentDate = currentDateObj.format('YYYY-MM-DD');
    if(sameDayDelivery && currentDate === selectedDeliveryDate){
        return true;
    }
    else {
        return false;
    }
}

module.exports = applyShippingOptionsToCheckout;