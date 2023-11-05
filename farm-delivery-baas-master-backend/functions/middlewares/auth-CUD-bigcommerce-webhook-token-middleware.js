const settings = require('../utils/settings');

const authenticateCUDBigCommerceWebhookToken = async (req, res, next) => {
    if (!req.headers['x-auth-token']) {
        console.log('unauthorized auth token');
        return res.status(403).send({'error':'Unauthorized'});
    }
    try {
        if(req.headers['x-auth-token'] === settings.CUD_bigcommerce_webhook_token){
            next();
            return;
        }
        else{
            console.log('unauthorized auth token');
            return res.status(403).send({'error':'Unauthorized'});
        }
    } catch(e) {
        console.log('unauthorized auth token');
        return res.status(403).send({'error':'Unauthorized'});
    }
}

module.exports = authenticateCUDBigCommerceWebhookToken;