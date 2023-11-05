const express = require('express');
const router = express.Router();

const keys = require('../../../utils/constants');
const authenticateMiddleware = require('../../../middlewares/token-auth-middleware');
var getCheckout = require('../../../utils/bigcommerce/checkout/get-checkout');
var createOrder = require('../../../utils/bigcommerce/order/create-order');
var updateOrder = require('../../../utils/bigcommerce/order/update-order');

router.post('/', authenticateMiddleware, function(req, res) {
    let checkoutId = req.body.checkout_id;
    getCheckout(checkoutId).then(checkoutObj => {
        createOrder(checkoutId).then(orderObj => {
            let deliveryData = req.body.delivery_data;
            let deliveryArea =  deliveryData[keys.area];
            let deliveryDate = deliveryData[keys.date];
            let deliveryTime = deliveryData[keys.time];
            let orderID = orderObj.id;
            let deliveryInfo = deliveryArea + ' ' + deliveryDate + ' ' + deliveryTime;
            let staffNotes = {
                "payment_method" : "Manual Payment",
                "payment_channel": "Cash-On-Delivery",
                "delivery_info": deliveryInfo,
            }
            let payload = {
                [keys.customer_message]: deliveryInfo,
                [keys.staff_notes]: JSON.stringify(staffNotes),
                [keys.status_id]: 11, // Awaiting Fulfillment
                [keys.payment_method]: 'Cash'
            }
            updateOrder(payload, orderID).then(updateOrderResponse => {
                console.log('successfully updated order -> ', orderID);
                return res.status(200).send({'response': updateOrderResponse});
            })
            .catch(error => {
                console.log('error in updating order '+ orderID, error);
                if(error.status === 500){
                    // The order is updated again in the following situation,
                    // When the order is placed and when the user is about to pay the amount, there is a chance that the inventory
                    // level for one or more products added to the order might be lower than the ordered quantity. In that situation,
                    // if it's tried to update the order, it'll throw 500 HTTP Status code. But the bug with Bigcommerce is, even it has
                    // thrown 500 status code, the status_id of the order is changed to '11' (Completed status) but no other data such as, customer_message, staff_notes, invoice_ID will not get updated. 
                    // So after this, any subsequent API call to Update Order API will result in 200 OK. So that is the reason we will be trying to update
                    // the order with the data.
                    updateOrder(payload, orderID).then(updateOrderResponse => {
                        console.log('successfully updated order -> ', orderID);
                        return res.status(200).send({'response': updateOrderResponse});
                    })
                    .catch(err => {
                        console.log('on second time update order error ', err);
                        return res.status(err.status).send(err);
                    });
                }
                else {
                    console.log('on second time update order error ', err);
                    return res.status(error.status).send(error);
                }
            });
            return;
        })
        .catch(error => {
            return res.status(error.status).send(error);
        });
        return;
    })
    .catch(error => {
        return res.status(error.status).send(error);
    });
});

module.exports = router;