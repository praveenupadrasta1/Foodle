const settings = require('../utils/settings');

const authenticateBigCommerceCallbackToken = async (req, res, next) => {
    if (!req.headers['x-callback-token']) {
        console.log('unauthorized callback token');
        return res.status(403).send({'error':'Unauthorized'});
    }
    try {
        if(req.headers['x-callback-token'] === settings.bigcommerce_callback_token){
            next();
            return;
        }
        else{
            console.log('unauthorized callback token');
            return res.status(403).send({'error':'Unauthorized'});
        }
    } catch(e) {
        console.log('unauthorized callback token');
        return res.status(403).send({'error':'Unauthorized'});
    }
}

module.exports = authenticateBigCommerceCallbackToken;