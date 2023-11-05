const express = require('express');
const router = express.Router();

const keys = require('../../../utils/constants');
var updateOrder = require('../../../utils/bigcommerce/order/update-order');
var authenticateXenditCallbackTokenMiddleware = require('../../../middlewares/xendit-callback-token-auth-middleware');

router.post('/', authenticateXenditCallbackTokenMiddleware, function(req, res) {
    let invoiceID = req.body.id;
    let description = req.body.description;
    let externalID = req.body.external_id;
    let paymentMethod = req.body.payment_method;
    let paidTime = req.body.paid_at;
    let paymentChannel = req.body.payment_channel;
    let paymentDestination = req.body.payment_destination;
    let tempData = externalID.split('/');
    // The order ID is in 1st index. The external ID format is "INV/{OrderID}/{user-email}/{delivery-area-code}"
    let orderID = tempData[1];
    let deliveryInfo = description.split('*/')[0].toString().replace('/*Delivery-info:', '');
    let staffNotes = {
        "payment_method" : paymentMethod,
        "payment_channel": paymentChannel,
        "delivery_info": deliveryInfo,
        "optional_params": {
            "invoice_id": invoiceID,
            "external_id": externalID,
            "paid_time": paidTime,
            "payment_destination": paymentDestination
        }
    }
    let payload = {
        [keys.customer_message]: deliveryInfo,
        [keys.staff_notes]: JSON.stringify(staffNotes),
        [keys.payment_provider_id]: invoiceID,
        [keys.status_id]: 11, // Awaiting Fulfillment
        [keys.payment_method]: 'Payment Gateway'
    }
    updateOrder(payload, orderID).then(updateOrderResponse => {
        console.log('successfully updated order -> ', orderID);
        return res.status(200).send({'msg':'callback recieved'});
    })
    .catch(error => {
        console.log('error in updating order '+ orderID + ' for user '+ tempData[2]);
        if(error.response.status === 500){
            // The order is updated again in the following situation,
            // When the order is placed and when the user is about to pay the amount, there is a chance that the inventory
            // level for one or more products added to the order might be lower than the ordered quantity. In that situation,
            // if it's tried to update the order, it'll throw 500 HTTP Status code. But the bug with Bigcommerce is, even it has
            // thrown 500 status code, the status_id of the order is changed to '11' (Completed status) but no other data such as, customer_message, staff_notes, invoice_ID will not get updated. 
            // So after this, any subsequent API call to Update Order API will result in 200 OK. So that is the reason we will be trying to update
            // the order with the data.
            updateOrder(payload, orderID).then(updateOrderResponse => {
                console.log('successfully updated order -> ', orderID);
                return res.status(200).send({'msg':'callback recieved'});
            })
            .catch(err => {
                let errr = err;
                return res.status(200).send({'msg':'callback recieved'});
            });
        }
        else{
            return res.status(200).send({'msg':'callback recieved'});
        }
    });
});

module.exports = router;