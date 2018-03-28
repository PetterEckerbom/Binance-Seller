const https = require("https");
const binance = require('node-binance-api');
const fs = require("fs");

//Defines a few global objects, arrays and varible
var pres = {};
var balance = [];
var sell_array = [];
var trade_to;

//Starts program
init();

function init(){
  //Reads the public and private keys
  fs.readFile("./settings/keys.txt", "utf8", (error, data) =>{
    if(error){
      console.log("Failed to read settings from keys.txt");
      return;
    }
    let line = data.split(/\n/);
    //Removes "New line markers (\r)"
    for(var i in line){
      line[i] = line[i].replace('\r', '');
    }
    //Provides the keys to the binance options for 'node-binance-api' library
    binance.options({
      APIKEY: line[0],
      APISECRET: line[1],
      useServerTime: true,
      test: false
    });
    //Reads in symbols for coins to exclude froms keys.txt
    fs.readFile("./settings/exclude.txt", "utf8", (error, data) =>{
      if(error){
        console.log("Failed to read settings from exclude.txt");
        return;
      }
      exclude = data.split(/\n/);
      //Removes "New line markers (\r)"
      for(var i in exclude){
        exclude[i] = exclude[i].replace('\r', '');
      }
      //reads what symbol the coin that should be traded to (this can be BTC, ETH, BNB or USDT)
      fs.readFile("./settings/trade_to.txt", "utf8", (error, data) =>{
        if(error){
          console.log("Failed to read settings from trade_to.txt");
          return;
        }
        let line = data.split(/\n/);
        //Removes "New line markers (\r)" and saves in global varible
        trade_to = line[0].replace('\r', '');;
        setTimeout(get_info, 2000)
      });
    });
  });
}

//Gets information for minimum quantity
function get_info(){
  let link = "https://api.binance.com/api/v1/exchangeInfo";
  https.get(link, (resp) =>{
    let data = '';
    resp.on('data', (chunk) => {
      data += chunk;
    });
    resp.on('end', () => {
      let jdata = JSON.parse(data);
      let symb = jdata.symbols;
      //Saves the the relevant info in pres arry
      for(var i in symb){
          pres[symb[i].symbol] = symb[i].filters[1].minQty;
      }
      //Calls the get quantity array
      get_quant();
    });
  });
}

function get_quant(){
  binance.balance((error, balances) => {
    //Extracts names of all the symbols
    var names = Object.keys(balances);
    for(var i in names){
      //If balance is higher than minimum sell quantity it can be sold
      if(balances[names[i]].available*1 > pres[names[i]+trade_to]*1){
        //Saves all the coins that can be sold to array
        sell_array.push([names[i]+trade_to, balances[names[i]].available]);
      }
    }
    //starts selling
    sell();
  });
}

var stepper = 0;
function sell(){
  //Check if we have looped through all sellable coins
  if(stepper < sell_array.length){
    //If the coin is not excluded we sell
    if(check_if_ex(sell_array[stepper][0].replace(trade_to, ''))){
      //rounds the balances since binance doesn't allow too small decimal points in their orders
      var sell_amount = Math.floor(sell_array[stepper][1] * (1/pres[sell_array[stepper][0]]) ) / (1/pres[sell_array[stepper][0]]);
      binance.marketSell(sell_array[stepper][0], sell_amount);
    }
    //Goes on to next coin
    stepper++;
    //Makes sure last order have been placed before doing next one;
    setTimeout(sell,500)
  }else{
    console.log("ALL DONE");
  }
}

//Checks if symbol is in exclude array.
function check_if_ex(symbol){
  for(var i in exclude){
    if(exclude[i] == symbol){
      return false;
    }
  }
  return true;
}
