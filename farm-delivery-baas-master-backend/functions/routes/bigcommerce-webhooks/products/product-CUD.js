const express = require('express');
const router = express.Router();

const authenticateBigCommerceCallbackToken = require('../../../middlewares/auth-bigcommerce-webhook-callback-token-middleware');
const getProduct = require('../../../utils/bigcommerce/product/get-product');
const createProduct = require('../../../utils/firebase_utils/firestore/product/create-product-firestore');
const updateProduct = require('../../../utils/firebase_utils/firestore/product/update-product-firestore');
const helperFn = require('../category/helpers/helper-functions');
const getCategory = require('../../../utils/bigcommerce/category/get-category');
const createCategory = require('../../../utils/firebase_utils/firestore/category/create-category-firestore');
const deleteProduct = require('../../../utils/firebase_utils/firestore/product/delete-product-firestore');

router.post('/', authenticateBigCommerceCallbackToken, function(req, res) {
    res.status(200).send({'msg':'recieved!'});
    let scope = req.body.scope;

    if(scope === 'store/product/created'){
        let productID = req.body.data.id;
        getProduct(productID).then(productResponse => {
            let productData = productResponse.data['data'];
            productData.description = productData.description.toString().replace('<p>','');
            productData.description = productData.description.toString().replace('</p>','');
            let productCategories = productData.categories;
            for(let categoryID of productCategories){
                helperFn.isCategoryExists(categoryID).then(isExist => {
                    return isExist;
                }).then(isExist => {
                    if(isExist){
                        createProduct(productData).then(productCreatedResponse => {
                            console.log('product ' + productID + ' successfully created!');
                            return;
                        }).catch(error => {
                            console.log('error in creating product '+ productID, error);
                            return;
                        });
                    }
                    else{
                        getCategory(categoryID).then(categoriesResponse => {
                            // Converting string to JSON. The description key has the values of the cities to which this category applies
                            // in json string format. So prune & convert to json.
                            categoriesResponse.data.data.description = categoriesResponse.data.data.description.replace('<p>','');
                            categoriesResponse.data.data.description = categoriesResponse.data.data.description.replace('</p>','');
                            categoryCitiesList = JSON.parse(categoriesResponse.data.data.description)['cities'];
                            categoriesResponse.data.data['cities'] = categoryCitiesList;
                            categoriesResponse.data.data.description = '';
                            createCategory(categoriesResponse.data.data).then(response => {
                                console.log('category ' + categoryID + ' successfully created!', response);
                                createProduct(productData).then(productCreatedResponse => {
                                    console.log('product ' + productID + ' successfully created!');
                                    return;
                                }).catch(error => {
                                    console.log('error in creating product '+ productID, error);
                                });
                                return;
                            }).catch(error => {
                                console.log('error creating category ', error);
                                return;
                            });
                            return;
                        }).catch(error => {
                            console.log('error in getting category '+ categoryID, error);
                            return;
                        });
                    }
                    return;
                }).catch(error => {
                    console.log(error);
                    return;
                });
            }
            return;
        })
        .catch(error => {
            console.log(error);
            return;
        });
    }
    else if(scope === 'store/product/updated' || scope === 'store/product/inventory/updated' ||
            scope === 'store/product/inventory/order/updated' || scope === 'store/sku/created' || 
            scope === 'store/sku/updated' || scope === 'store/sku/deleted'|| scope === 'store/sku/inventory/updated' ||
            scope === 'store/sku/inventory/order/updated'){
        let productID;
        if(scope === 'store/product/updated'){
            productID = req.body.data.id;
        }
        else if(scope === 'store/sku/created' || scope === 'store/sku/updated' || scope === 'store/sku/deleted'){
            productID = req.body.data.sku.product_id;
        }
        else if(scope === 'store/product/inventory/updated' || scope === 'store/product/inventory/order/updated' ||
        scope === 'store/sku/inventory/updated' || scope === 'store/sku/inventory/order/updated'){
            productID = req.body.data.inventory.product_id;
        }

        getProduct(productID).then(productResponse => {
            let productData = productResponse.data['data'];
            productData.description = productData.description.toString().replace('<p>','');
            productData.description = productData.description.toString().replace('</p>','');
            let productCategories = productData.categories;
            for(let categoryID of productCategories){
                helperFn.isCategoryExists(categoryID).then(isExist => {
                    return isExist;
                }).then(isExist => {
                    if(isExist){
                        updateProduct(productData).then(productCreatedResponse => {
                            console.log('product ' + productID + ' successfully updated!');
                            return;
                        }).catch(error => {
                            console.log('error in creating product '+ productID, error);
                            return;
                        });
                    }
                    else{
                        getCategory(categoryID).then(categoriesResponse => {
                            // Converting string to JSON. The description key has the values of the cities to which this category applies
                            // in json string format. So prune & convert to json.
                            categoriesResponse.data.data.description = categoriesResponse.data.data.description.replace('<p>','');
                            categoriesResponse.data.data.description = categoriesResponse.data.data.description.replace('</p>','');
                            categoryCitiesList = JSON.parse(categoriesResponse.data.data.description)['cities'];
                            categoriesResponse.data.data['cities'] = categoryCitiesList;
                            categoriesResponse.data.data.description = '';
                            createCategory(categoriesResponse.data.data).then(response => {
                                console.log('category ' + categoryID + ' successfully created!');
                                updateProduct(productData).then(productCreatedResponse => {
                                    console.log('product ' + productID + ' successfully updated!');
                                    return;
                                }).catch(error => {
                                    console.log('error in updated product '+ productID, error);
                                    return;
                                });
                                return;
                            }).catch(error => {
                                console.log('error creating category ', error);
                                return;
                            });
                            return;
                        }).catch(error => {
                            console.log('error in getting category '+ categoryID, error);
                            return;
                        });
                    }
                    return;
                }).catch(error => {
                    console.log(error);
                    return;
                });
            }
            return;
        })
        .catch(error => {
            console.log(error);
            return;
        });   
    }
    else if(scope === 'store/product/deleted'){
        let productID = req.body.data.id;
        deleteProduct(productID).then(response => {
            console.log('product ' + productID + ' successfully deleted!', response);
            return;
        }).catch(error => {
            console.log('error deleting product ', error);
            return;
        });
    }
    // else if(scope === 'store/sku/deleted'){
    //     let productID = req.body.data.sku.variant_id;
    //     deleteProduct(productID).then(response => {
    //         console.log('product ' + productID + ' successfully deleted!', response);
    //     }).catch(error => {
    //         console.log('error deleting product ', error);
    //         return;
    //     });
    // }
    else{
        console.log('unknown scope for product webhook');
    }
});

module.exports = router;