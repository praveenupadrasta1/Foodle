const getSpecifiedProducts = require('../../../utils/firebase_utils/firestore/product/get-specified-products-firestore');
const helperFns = require('./helper-functions');
const settings = require('../../../utils/settings');

function getProductsSubset(productsID){
    return new Promise(async (resolve, reject) => {

        let productIncludeFields = ['id','name','description','meta_description', 'order_quantity_minimum',
        'order_quantity_maximum', 'categories', 'images', 'custom_fields'];

        let variantIncludeFields = ['option_values','price', 'sale_price', 'retail_price', 
                'inventory_level', 'inventory_warning_level', 
                'product_id', 'id', 'purchasing_disabled'];

        // This is done because, as per Firestore Constraint, its only possible to query 10 products at a time using 'IN' query.
        let noOfRoundTripsToDB = Math.ceil(productsID.length / settings.firestore_IN_query_list_threshold);
        let productsSubsets = [];
        for(i = 0; i < noOfRoundTripsToDB; i++){
            if(productsID.length >= settings.firestore_IN_query_list_threshold){
                productsSubsets.push(productsID.splice(0, settings.firestore_IN_query_list_threshold));
            }
            else{
                productsSubsets.push(productsID.splice(0, productsID.length));
            }
        }
        
        let promises = [];
        for(j = 0; j < productsSubsets.length; j++){
            promises.push(getSpecifiedProducts(productsSubsets[j]).then(response => {
                let products = helperFns.pruneProducts(response, productIncludeFields, variantIncludeFields);
                return products;
            })
            .catch(error => {
                error = {'error': 'Kesalahan terjadi saat memproses permintaan Anda!',
                'status': 400};
                reject(error);
                return;
            }));
        }

        await Promise.all(promises).then(productsLists => {
            let temp = [];
            for(let productList of productsLists){
                for(let product of productList)
                {
                    temp.push(product);
                }
            }
            resolve(temp);
            return;
        }).catch(error => {
            error = {'error': 'Kesalahan terjadi saat memproses permintaan Anda!',
                    'status': 400};
            reject(error);
            return;
        })
    });
}

module.exports = getProductsSubset;