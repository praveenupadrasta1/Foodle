var mung = require('express-mung');

let epochTimeStamp = function(body, req, res){
    body['timestamp'] = (Math.round(new Date().getTime()/1000));
    return body;
}

module.exports = mung.json(epochTimeStamp);