const express = require('express');
const router = express.Router();

const authenticateBigCommerceCallbackToken = require('../../../middlewares/auth-bigcommerce-webhook-callback-token-middleware');
const getCategory = require('../../../utils/bigcommerce/category/get-category');
const createCategory = require('../../../utils/firebase_utils/firestore/category/create-category-firestore');
const updateCategory = require('../../../utils/firebase_utils/firestore/category/update-category-firestore');
const deleteCategory = require('../../../utils/firebase_utils/firestore/category/delete-category-firestore');
const helperFns = require('./helpers/helper-functions');

router.post('/', authenticateBigCommerceCallbackToken, function(req, res) {
    res.status(200).send({'msg':'recieved!'});
    let scope = req.body.scope;
    let categoryID = req.body.data.id;
    
    if(scope === 'store/category/created'){
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
    else if(scope === 'store/category/updated'){
        getCategory(categoryID).then(categoriesResponse => {
            // Converting string to JSON. The description key has the values of the cities to which this category applies
            // in json string format. So prune & convert to json.
            categoriesResponse.data.data.description = categoriesResponse.data.data.description.replace('<p>','');
            categoriesResponse.data.data.description = categoriesResponse.data.data.description.replace('</p>','');
            categoryCitiesList = JSON.parse(categoriesResponse.data.data.description)['cities'];
            categoriesResponse.data.data['cities'] = categoryCitiesList;
            categoriesResponse.data.data.description = '';
            helperFns.isCategoryExists(categoryID).then((isCategoryExists) => {
                if(isCategoryExists){
                    updateCategory(categoriesResponse.data.data).then(response => {
                        console.log('category ' + categoryID + ' successfully updated!');
                        return;
                    }).catch(error => {
                        console.log('error updating category ', error);
                        return;
                    });
                }
                else{
                    createCategory(categoriesResponse.data.data).then(response => {
                        console.log('category ' + categoryID + ' successfully created!');
                        return;
                    }).catch(error => {
                        console.log('error creating category ', error);
                        return;
                    });
                }
                return;
            }).catch(error => {
                console.log('error updating category ', error);
                return;
            });
            return;
        }).catch(error => {
            console.log('error in getting category '+ categoryID, error);
            return;
        });
    }
    else if(scope === 'store/category/deleted'){
        deleteCategory(categoryID).then(response => {
            console.log('category ' + categoryID + ' successfully deleted!', response);
            return;
        }).catch(error => {
            console.log('error deleting category ', error);
            return;
        })
    }
    else{
        console.log('unknown scope for category webhook');
    }
});

module.exports = router;