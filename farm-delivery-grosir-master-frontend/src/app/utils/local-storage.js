import * as keys from './json-keys';

export let getCurrentCityCart = function(uid, deliveryCity){
    let cart = JSON.parse(localStorage.getItem(uid + '*' + deliveryCity));
    if(cart){
        return cart;
    }
    else{
        return 0;
    }
}

export let createCart = function(uid, deliveryCity){
    try{
        localStorage.setItem(uid + '*' +deliveryCity, JSON.stringify({ [keys.line_items] : {} }));
        return 1;
    }
    catch(error){
        return 0;
    }
}

export let getProductFromCart = function(cart, variantID){
    if(variantID in cart[keys.line_items]){
        return cart[keys.line_items][variantID];
    }
    else{
        return 0;
    }
}

export let updateCart = function(uid, deliveryCity, cart){
    try{
        localStorage.setItem(uid + '*' + deliveryCity, JSON.stringify(cart));
        return 1;
    }
    catch(error){
        return 0;
    }
}

export let createProductInCart = function(uid, deliveryCity, variantID, productData){
    let cart = JSON.parse(localStorage.getItem(uid + '*' + deliveryCity));
    cart[keys.line_items][variantID] = productData;
    return updateCart(uid, deliveryCity, cart);
}

export let updateProductQtyInCart = function(uid, deliveryCity, variantID, quantity){
    let cart = JSON.parse(localStorage.getItem(uid + '*' + deliveryCity));
    cart[keys.line_items][variantID][keys.quantity] = quantity;
    return updateCart(uid, deliveryCity, cart);
}

export let updateProductUnitPriceInCart = function(uid, deliveryCity, variantID, unit_price){
    let cart = JSON.parse(localStorage.getItem(uid + '*' + deliveryCity));
    cart[keys.line_items][variantID][keys.unit_price] = unit_price;
    return updateCart(uid, deliveryCity, cart);
}

export let deleteCart = function(uid, deliveryCity){
    localStorage.removeItem(uid + '*' + deliveryCity);
}

// export let updateProductValidityInCart = function(deliveryCity, variantID, isValid){
//     let cart = localStorage.getCurrentCityCart(deliveryCity);
//     if(cart){
//         cart[keys.line_items][variantID][isValid] = isValid;
//     }
// }

export let removeProductFromCart = function(uid, deliveryCity, variantID){
    let cart = JSON.parse(localStorage.getItem(uid + '*' + deliveryCity));
    delete cart[keys.line_items][variantID];
    return updateCart(uid, deliveryCity, cart);
}

export let setFirebaseAuthToken = function(accessToken, refreshToken){
    try{
        localStorage.setItem(accessToken, JSON.stringify({ [keys.access_token] : {} }));
        localStorage.setItem(refreshToken, JSON.stringify({ [keys.refresh_token] : {} }));
        return 1;
    }
    catch(error){
        return 0;
    }
}

export let getIdToken = function(){
    let access_token = JSON.parse(localStorage.getItem(keys.access_token));
    if(access_token){
        return access_token;
    }
    else{
        return 0;
    }
}

export let getRefreshToken = function(){
    let refresh_token = JSON.parse(localStorage.getItem(keys.refresh_token));
    if(refresh_token){
        return refresh_token;
    }
    else{
        return 0;
    }
}
