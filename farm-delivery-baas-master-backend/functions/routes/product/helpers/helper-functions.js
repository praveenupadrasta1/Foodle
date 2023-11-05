module.exports = {
    pruneProducts: function(products, productIncludeFields, variantIncludeFields){
        let prunedProducts = [];
        for(let product of products){
            let tempVariants = [];
            for(let variant of product.variants){
                let variantDict = {};
                variantIncludeFields.forEach(field => {
                    variantDict[field] = variant[field];
                });
                tempVariants.push(variantDict);
            }
            if(tempVariants.length > 0){
                productDict = {};
                productIncludeFields.forEach(field => {
                    productDict[field] = product[field];
                });
                productDict['variants'] = tempVariants;
                prunedProducts.push(productDict);
            }
        }
        return prunedProducts;
    },

    pruneProductVariantsFields: function(products, variantIncludeFields){
        let prunedProducts = [];
        for(let product of products){
            product.description = product.description.toString().replace('<p>','');
            product.description = product.description.toString().replace('</p>','');
            let tempVariants = [];
            for(let variant of product.variants){
                let variantDict = {};
                variantIncludeFields.forEach(field => {
                    variantDict[field] = variant[field];
                });
                tempVariants.push(variantDict);
            }
            if(tempVariants.length > 0){
                product['variants'] = tempVariants;
                prunedProducts.push(product);
            }
        }
        return prunedProducts;
    },

    getVariantsOfProducts: function(products, variantIncludeFields){
        let variants = [];
        for(let product of products){
            for(let variant of product.variants){
                let variantDict = {};
                variantIncludeFields.forEach(field => {
                    variantDict[field] = variant[field];
                });
                variants.push(variantDict);
            }
        }
        return variants;
    }
}