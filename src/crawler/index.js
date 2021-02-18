require('dotenv').config();

const poloniex = require('lib/poloniex');
const db = require('db');
const ExchangeRate = require('db/models/ExchangeRate')
const socket = require('./socket');
const {parseJSON} = require('lib/common');
db.connect();
socket.connect();

async function registerInitialExchangeRate(){
    const tickers = await poloniex.getTickers();

    //remove all data from th collection (only for temporary use)
    await ExchangeRate.drop();
    console.log('dropped exchange collection');
    
    const keys = Object.keys(tickers);
    const promises = keys.map(
        key=>{
            const ticker = tickers[key];
            const data = Object.assign({name:key},ticker);
            const exchangeRate = new ExchangeRate(data);
            return exchangeRate.save()
        }
    )
    try{
        await Promise.all(promises);
    }catch(e){
        console.log(e);
    }
    console.log('success');
}

async function updateEntireRate(){
    const tickers = await poloniex.getTickers();
    const keys = Object.keys(tickers);
    const promises = keys.map(
        key=>{
            return ExchangeRate.updateTicker(key,tickers[key])
        }
    )
    try{
        await Promise.all(promises);
    }catch(e){
        console.log('Oops,failed to refresh');
        return;
    }
    console.log('Updated entire rate ');
    
}



const messageHandler = {
    1002:async (data) =>{
        if (!data) return;
        const converted = poloniex.convertToTickerObject(data);
        const {name,...rest} = converted;
        if(!name) return;
        if(name === 'null') return;
        // console.log('......................................');
        // console.log(converted);
        try{
            const updated = await ExchangeRate.updateTicker(name,rest);
            // console.log('Updated',{name});
            }catch(e){
                console.log(e);
            }
        }
    }

socket.handleMessage = (message)=>{
    const parsed = parseJSON(message);
    if(!parsed){
        return null;
    }
    const [type,meta,data] = parsed;
    if(messageHandler[type]){
        messageHandler[type](data)
    }
    // console.log(message);
}

socket.handleRefresh = () =>{
    updateEntireRate();
    registerInitialExchangeRate();
}

