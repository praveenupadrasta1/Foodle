const express = require('express');
const router = express.Router();

const keys = require('../../../../utils/constants');
var updateOrder = require('../../../../utils/bigcommerce/order/update-order');
var authenticateXenditCallbackTokenMiddleware = require('../../../../middlewares/xendit-callback-token-auth-middleware');

router.post('/', authenticateXenditCallbackTokenMiddleware, function(req, res) {
    if(req.body.payment_status === 'PAID'){
        let amount = req.body.amount;
        let paidTime = req.body.transaction_date;
        let businessId = req.body.business_id;

        let externalID = req.body.external_id;
        let tempData = externalID.split('-');
        //The external ID format is "{OrderID}-{deliveryDateTimeFrom} {deliveryDateTimeTo}-{deliveryArea}"
        let orderID = tempData[0];
        let deliveryInfo = tempData[2] + ' ' + tempData[1];
        let payload = {
            [keys.customer_message]: deliveryInfo,
            [keys.staff_notes]: 'Paid Rp. '+ amount +' using DANA with payment ID '
                                +  paymentId 
                                + ' ExternalID - ' + externalID 
                                + ' at Date & Time - ' + paidTime
                                + ' Merchant Business ID - ' + businessId,
            [keys.payment_provider_id]: paymentId,
            [keys.status_id]: 10
        }
        updateOrder(payload, orderID).then(updateOrderResponse => {
            console.log('successfully updated order -> ', orderID);
            return res.status(200).send({'msg':'callback recieved'});
        })
        .catch(error => {
            console.log('error in updating order '+ orderID + ' for user '+ tempData[3]);
            if(error.response.status === 500){
                // The order is updated again in the following situation,
                // When the order is placed and when the user is about to pay the amount, there is a chance that the inventory
                // level for one or more products added to the order might be lower than the ordered quantity. In that situation,
                // if it's tried to update the order, it'll throw 500 HTTP Status code. But the bug with Bigcommerce is, even it has
                // thrown 500 status code, the status_id of the order is changed to '10' (Completed status) but no other data such as, customer_message, staff_notes, invoice_ID will not get updated. 
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
    }
    else{
        return res.status(200).send({'msg':'callback recieved'});
    }
});

module.exports = router;