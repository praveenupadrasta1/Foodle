module.exports = {
    pruneOrderFields: function(orders, includeFields){
        let tempOrders = [];
        for(let order of orders){
            let dict = {};
            includeFields.forEach(field => {
                dict[field] = order[field];
            });
            tempOrders.push(dict);
        }
        return tempOrders;
    }
}