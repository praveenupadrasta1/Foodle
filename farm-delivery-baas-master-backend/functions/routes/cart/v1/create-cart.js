const express = require('express');
const router = express.Router();
const authenticateMiddleware = require('../../../middlewares/token-auth-middleware');

const keys = require('../../../utils/constants');
const errorCodes = require('../../../utils/error-codes');

var getCity = require('../../city/helpers/get-city');
var validateData = require('../helpers/validate-data');
var createCart = require('../../../utils/bigcommerce/cart/create-cart');
var getCustomer = require('../../../utils/firebase_utils/firestore/customer/get-customer-firestore');

router.post('/', authenticateMiddleware, function(req, res) {
    try{
        let deliveryData = req.body[keys.delivery_data];

        // Make the validations asynchronous later.
        // Check if the delivery data is correct or not.
        getCity(deliveryData[keys.area])
            .then(cityData => {
                let isValidDeliveryDateTime = validateData.validateDeliveryDateTime(deliveryData[keys.date], 
                                        deliveryData[keys.time], cityData);
                if(isValidDeliveryDateTime){
                    // Validate whether the variants are of same delivery city and inventory level
                    validateData.validateLineItems(req.body[keys.line_items], 
                                                    deliveryData[keys.area])
                    .then(validationResponse => {
                        getCustomer(req.user.email).then((users) => {
                            if(users.length){
                                let user = users[0];
                                // Create Cart
                                let lineItems = req.body[keys.line_items];
                                let payload = { 
                                    [keys.line_items]: lineItems,
                                    [keys.customer_id]: user.id
                                }
                                createCart(payload).then(cartResponse => {
                                    return res.status(200).send({'cart_data': cartResponse,
                                                                'city_data': cityData,
                                                                'delivery_data': deliveryData});
                                }).catch(error => {
                                    return res.status(error.status).send(error);
                                });
                            }
                            else{
                                return res.status(400).send({'error': 'Kesalahan terjadi saat memproses permintaan Anda!'});
                            }
                            return;
                        }).catch((error) => {
                            return res.status(error.status).send(error);
                        });
                        return;
                    })
                    .catch(error => {
                        return res.status(error.status).send(error);
                    });
                }
                else{
                    return res.status(400).send({'error':'Tanggal atau waktu pengiriman yang dipilih tidak valid',
                                                'error_code': errorCodes['000']});
                }
                return;
            })
            .catch(error => {
                return res.status(400).send({'error': 'Tidak ada area pengiriman seperti itu!',
                                            'error_code': errorCodes['000']});
            });
    }
    catch(error){
        return res.status(400).send({'error': 'Kesalahan terjadi saat memproses permintaan Anda!'});
    }
});

module.exports = router;