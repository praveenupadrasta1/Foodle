export let storeInSession = function(key, data){
    data = JSON.stringify(data);
    sessionStorage.setItem(key, data);
}

export let getFromSession = function(key){
    return JSON.parse(sessionStorage.getItem(key));
}

export let removeFromSession = function(key){
    sessionStorage.removeItem(key);
}