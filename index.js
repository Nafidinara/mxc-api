const fetch = require('node-fetch');
const readlineSync = require('readline-sync');
const CryptoJS = require("crypto-js");
var lodash = require('lodash');
const { split } = require('lodash');

const ApiKey = 'mx0SnRlsMB3sqRFZsd';
const SecretKey = '189d8f9ca8a445d7ad2b2c8df4b20a34';
const baseUrl = 'https://www.mxc.com';

const baseParams = {
    'api_key' : ApiKey,
    'req_time' : Math.floor(Date.now() / 1000)
}


const signature = (method,pathname,params) => {
    let dateNow = Math.floor(Date.now() / 1000);
    // return dateNow;
    // return CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(ApiKey+dateNow, SecretKey));
    return CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(''+method+'\n'+pathname+'\n'+params+'', SecretKey));
    // return '1b788d9b22efd7e535f14f2fa0d7013cf5e07ad73fd654d13402ce73c1c62e43';
    // return ''+method+'\n'+pathname+'\n'+params+'';
}


const balance = () => new Promise((resolve, reject) => {
    let url = new URL(baseUrl+'/open/api/v2/account/info');

    // baseParams['sddsd'] = 'sds';

    url.search = new URLSearchParams(baseParams).toString();
    let sign = signature('GET',url.pathname,url.searchParams);
    url.searchParams.append('sign', sign);

    fetch(url, {
        method: 'GET',
        headers : {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(res => {
            console.log(url);
            console.log(res);
            resolve(res);
        })
        .catch(err => {
            reject(err)
        })
});

const symbols = () => new Promise((resolve, reject) => {
    let url = new URL(baseUrl+'/open/api/v2/market/symbols');

    // url.search = new URLSearchParams(baseParams).toString();
    // let sign = signature(url.pathname,url.searchParams);
    // url.searchParams.append('sign', sign);

    fetch(url, {
        method: 'GET',
        headers : {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            resolve(res);
        })
        .catch(err => {
            reject(err)
        })
});

const placeOrder = () => new Promise((resolve, reject) => {
    let url = new URL(baseUrl+'/open/api/v2/order/place');

    let body = {
    'symbol': 'ETH_USDT',
    'price': 5000,
    'quantity': 0.1,
    'trade_type': 'BID',
    'order_type': 'LIMIT_ORDER'
    };

    url.search = new URLSearchParams(baseParams).toString();
    let sign = signature('POST',url.pathname,url.searchParams);
    url.searchParams.append('sign', sign);

    fetch(url, {
        method: 'POST',
        headers : {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(body)
    })
        .then(res => res.json())
        .then(res => {
            // console.log(url);
            console.log(res);
            resolve(res);
        })
        .catch(err => {
            reject(err)
        })
});

(async () => {
    await placeOrder();
})();