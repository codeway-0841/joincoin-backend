const currencyPairMap = require('./currencyPairMap');
const axios = require('axios');

function getCurrencyPairMap(id){
    return currencyPairMap[id.toString()];
};

function getTickers(){
    return axios.get('https://poloniex.com/public?command=returnTicker').then(
        response => response.data
        );
};
function convertToTickerObject(data){
    const keys = [
        "id",
        "last",
        "lowestAsk",
        "highestBid",
        "percentChange",
        "baseVolume",
        "quoteVolume",
        "isFrozen",
        "high24r",
        "low24r"
    ];
    const object = {};
    data.forEach((value,i) =>{
        //sets the name value
        if(i == 0){
            object.name = getCurrencyPairMap(value)
            return;
        }
        const key = keys[i];
        object[key] = value;
    });
    return object;
};

module.exports = (function(){
    return{
        getCurrencyPairMap,
        getTickers,
        convertToTickerObject
    };
})();