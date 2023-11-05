var moment = require('moment-timezone');

const keys = require('../../../utils/constants');
const errorCodes = require('../../../utils/error-codes');
let getProductsSubset = require('../../product/helpers/get-products-subset');

module.exports = {
    validateDeliveryDateTime: function (selectedDeliveryDate, selectedDeliveryTime, cityData){
        let nextNDaysAcceptOrders = cityData[keys.next_n_days_accept_orders];
        let sameDayDelivery = cityData[keys.same_day_delivery];
        let timezone = cityData[keys.timezone];

        let currentDateObj = moment().tz(timezone);
        let currentDate = currentDateObj.format('YYYY-MM-DD');

        let currentTime = moment(currentDateObj.format('hh:mmA'), 'hh:mmA');
        let orderAcceptBeforeNHours = cityData[keys.order_accept_before_n_hours];
        let deliveryTimings = cityData[keys.delivery_timings];

        let orderPossibleDatesTimes = getDeliveryPossibleDatesTimes(nextNDaysAcceptOrders, 
                                                            sameDayDelivery, 
                                                            currentDateObj,
                                                            orderAcceptBeforeNHours, 
                                                            deliveryTimings, 
                                                            currentTime);
        
        let selectedDeliveryDateTime = selectedDeliveryDate + ' ' + selectedDeliveryTime;
        if(orderPossibleDatesTimes.includes(selectedDeliveryDateTime)){
            return 1;
        }            
        else{
            return 0;
        }                                            
    },

    validateLineItems: function (lineItems, deliveryCity){
        return new Promise(function(resolve, reject) {
            let productsID = getProductsID(lineItems);
            getProductsSubset(productsID).then(productsData => {
                let result = isLineItemsValid(productsData, deliveryCity, lineItems);
                if(result.is_valid){
                    resolve(result.is_valid);
                }
                else{
                    let error = {'error': result,
                                'status': 400};
                    reject(error);
                }
                return;
            }).catch(error => {
                reject(error);
            });
        });
    }
}

function getProductsID(lineItems){
    let productsID = [];
    for(let item of lineItems){
        productsID.push(item[keys.product_id]);
    }
    return productsID;
}

function isLineItemsValid(productsData, deliveryCity, lineItems){
    let productsOfLowStock = [];
    let productsNotExist = [];
    let variantNotExist = [];
    for(let item of lineItems){
        let product = getProductAndVariantData(productsData, item[keys.variant_id], item[keys.product_id]);
        if(product){
            let variant = product.variants[0];
            if(variant[keys.option_values][0][keys.label] !== deliveryCity){
                productsNotExist.push(product);
            }
            else if(variant[keys.inventory_level] < item[keys.quantity]){
                productsOfLowStock.push(product);
            }
        }
        else{
            variantNotExist.push(item);
        }
    }
    if(productsNotExist.length && productsOfLowStock.length && variantNotExist.length){
        return {
            'is_valid': false,
            'error': 'Satu atau lebih produk dalam keranjang tidak ada atau stok rendah, sehingga kuantitasnya disesuaikan secara otomatis',
            'error_code': errorCodes['008'],
            'items_bad_data': productsNotExist,
            'items_low_stock': productsOfLowStock,
            'items_bad_variants': variantNotExist
        }
    }
    else if(productsNotExist.length &&  variantNotExist.length){
        return {
            'is_valid': false,
            'error': 'Satu atau lebih produk di keranjang tidak ada, jadi dihapus secara otomatis',
            'error_code': errorCodes['009'],
            'items_bad_data': productsNotExist,
            'items_bad_variants': variantNotExist
        }
    }
    else if(productsOfLowStock.length && variantNotExist.length){
        return {
            'is_valid': false,
            'error': 'Satu atau lebih produk dalam keranjang tidak ada atau stok rendah, sehingga kuantitasnya disesuaikan secara otomatis',
            'error_code': errorCodes['010'],
            'items_low_stock': productsOfLowStock,
            'items_bad_variants': variantNotExist
        }
    }
    else if(productsNotExist.length && productsOfLowStock.length){
        return {
            'is_valid': false,
            'error': 'Satu atau lebih produk dalam keranjang tidak ada atau stok rendah, sehingga kuantitasnya disesuaikan secara otomatis',
            'error_code': errorCodes['001'],
            'items_bad_data': productsNotExist,
            'items_low_stock': productsOfLowStock
        }
    }
    else if(productsOfLowStock.length){
        return {
            'is_valid': false,
            'error': 'Satu atau lebih produk dalam keranjang tidak memiliki stok yang cukup, sehingga kuantitasnya disesuaikan secara otomatis',
            'error_code': errorCodes['002'],
            'items_low_stock': productsOfLowStock
        }
    }
    else if(productsNotExist.length){
        return {
            'is_valid': false,
            'error': 'Satu atau lebih produk di keranjang tidak ada, jadi dihapus secara otomatis',
            'error_code': errorCodes['003'],
            'items_bad_data': productsNotExist
        }
    }
    else if(variantNotExist.length){
        return {
            'is_valid': false,
            'error': 'Satu atau lebih produk di keranjang tidak ada, jadi dihapus secara otomatis',
            'error_code': errorCodes['007'],
            'items_bad_variants': variantNotExist
        }
    }
    else{
        return {
            'is_valid': true
        }
    }
}

function getProductAndVariantData(productsData, variantID, productID){
    for(let product of productsData){
        for(let variant of product.variants){
            if(variant[keys.product_id] === productID && variant[keys.id] === variantID && variant[keys.purchasing_disabled] === false){
                delete product['variants'];
                product['variants'] = [];
                product['variants'].push(variant);
                return product;
            }
        }
    }
    return null;
}

function getDeliveryPossibleDatesTimes(nextNDaysAcceptOrders, sameDayDelivery, currentDate,
                                    orderAcceptBeforeNHours, deliveryTimings, currentTime){
    let i=0;
    let orderPossibleDatesTimes = [];

    if(!sameDayDelivery){
        i=1;
    }

    for(;i<=nextNDaysAcceptOrders; i++){
        let times = deliveryTimings.split(', ');
        for(let time of times){
            let tempDate = currentDate.clone();
            let deliveryStartTime = time.split(' to ')[0];
            let possibleDateTime = moment(tempDate.add(i, 'days').format('YYYY-MM-DD') + deliveryStartTime, 'YYYY-MM-DD hh:mm:A');
            let isValid = isDeliveryPossibleTime(orderAcceptBeforeNHours, 
                                                possibleDateTime, currentTime);
            if(isValid){                     
                let date = tempDate.clone().format('YYYY-MM-DD');
                orderPossibleDatesTimes.push(date + ' ' + time);
            }
        }
    }
    return orderPossibleDatesTimes;
}

function isDeliveryPossibleTime(orderAcceptBeforeNHours, possibleDateTime, currentTime){
    let orderPlacingExpiryTime = possibleDateTime.subtract(orderAcceptBeforeNHours, 'hours');
    if(currentTime < orderPlacingExpiryTime){
        return 1;
    }
    return 0;
}
