const express = require('express');
const router = express.Router();

const authenticateBigCommerceCallbackToken = require('../../../middlewares/auth-bigcommerce-webhook-callback-token-middleware');
const getOrderCoupons = require('../../../utils/bigcommerce/order/get-order-coupons');
const getOrder = require('../../../utils/bigcommerce/order/get-order');
const updatePromotionStoreData = require('../../../utils/firebase_utils/firestore/promotion-store/update-store-data');
const helperFn = require('../order/helpers/helper-functions');
const sendAutomaticEmail = require('../../../utils/email/send-automatic-email');
const emailTemplate = require('../../../utils/email/promotion-store-html-template');

router.post('/', authenticateBigCommerceCallbackToken, function(req, res) {
    res.status(200).send({'msg':'recieved!'});
    let scope = req.body.scope;
    
    if(scope === 'store/order/statusUpdated'){
        let orderID = req.body.data.id;
        getOrderCoupons(orderID).then(orderCoupons => {
            if(orderCoupons.length > 0){
                for(let coupon of orderCoupons){
                    let couponCode = coupon.code;
                    helperFn.isPromotionStoreExist(couponCode).then(promotionStoreData => {
                        if(promotionStoreData){
                            getOrder(orderID).then(orderData => {
                                // Update the Promotion store data only if the order is placed. 
                                // Status ID 10 denotes the orders is successfully delivered.
                                if(orderData['status_id'] === 10) {
                                    let totalExcTax = orderData['total_ex_tax'];
                                    let shippingCostIncTax = orderData['shipping_cost_inc_tax'];
                                    let netOrderValue = totalExcTax - shippingCostIncTax;
                                    let commissionPercent = promotionStoreData['commission_percent'];
                                    let totalCommission = 0;
                                    if(netOrderValue > 0){
                                        totalCommission = Math.round(netOrderValue * (commissionPercent / 100));
                                    }
                                    promotionStoreData['no_of_orders'] = promotionStoreData['no_of_orders'] + 1;
                                    promotionStoreData['orders'][orderData['id']] = {
                                        order_id: orderData['id'],
                                        net_order_value: netOrderValue,
                                        earnings: totalCommission,
                                        commission_percent: commissionPercent
                                    }

                                    // Update promotion store data in firestore
                                    updatePromotionStoreData(promotionStoreData).then(updatedResponse => {
                                        console.log('promotion store with coupon code ' + couponCode + ' successfully updated!');
                                        return;
                                    }).catch(error => {
                                        console.log('error updating promotion store ', error);
                                        return;
                                    });
                                    let summaryData = helperFn.getTotalEarningsNTotalNetOrdersValue(promotionStoreData['orders']);
                                    let totEarnings = summaryData['tot_earnings'];
                                    // let totNetOrdersValue = summaryData['tot_net_orders_value'];

                                    // Send automatic email to the store
                                    const message = {
                                        from: 'no-reply@foodle.id',
                                        to: promotionStoreData['email'],
                                        subject: 'Selamat Anda mendapatkan pesan dari Foodle!',
                                        html: emailTemplate.getOrderCreatedHTMLTemplate(netOrderValue, totalCommission, totEarnings, couponCode, orderData['id'])
                                    };
                                    sendAutomaticEmail(message).then(res => {
                                        console.log('Email sent to the store ' + promotionStoreData['name']);
                                        return;
                                    }).catch(err => {
                                        console.log('error sending automatic no-reply email ', err);
                                        return;
                                    });
                                }
                                return;
                            }).catch(error => {
                                console.log('Error getting order data from Bigcommerce', error);
                                return;
                            });
                        }
                        return;
                    }).catch(error => {
                        console.log('Error getting Promotion Store data ', error);
                        return;
                    });
                }
            }
            return;
        })
        .catch(error => {
            console.log('Error while getting OrderCoupons from Bigcommerce ', error);
            return;
        });
    }
    else{
        console.log('unknown scope for order webhook');
    }
});

module.exports = router;