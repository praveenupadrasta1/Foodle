import * as moment from 'moment';

export let getCurrentDateTime = function(){
    return moment();
}

export let getCurrentTimestamp = function(){
    return moment().unix();
}