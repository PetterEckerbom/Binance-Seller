Binance Seller
===

Description
---
This program is a NodeJS based application that sells all your crypto-currencies on your binance account.

The program is particularly useful for people who have a lot of refferals as they will accumulate a lot
of coins that they have no intrest of. It can be a tedious task to go through and find which ones can be sold manually

It uses the NodeJS library ['node-binance-api'](https://github.com/jaggedsoft/node-binance-api) to place the orders.

How to configure
---

Before starting the program you need to edit a few settings, the setting are changed in .txt files in the "Settings" folder

---

**exclude.txt**

In this file you put the symbols of the coins you wish to keep. By default it is configured to not sell BNB.

Write one symbol on each line, only write one symbol per line. If you write more than one symbol per line it will not exclude any of them.
Make sure to spell the symbols correctly and use CAPITAL letters

---

**keys.txt**

In this section you fill in your private and public API keys. These can be created [here](https://www.binance.com/userCenter/createApi.html)
(make sure to be logged in when clicking).

On the first line you put the secret and on the second one you put the public API key

---

**trade_to.txt**

In this file you simply write what you want to get paid in. As default it is BTC

The options you can choose is: BTC, ETH, BNB or USDT


How to run
---

In order to use the program you need to have [NodeJS](https://nodejs.org/en/) installed on your computer.

Run by using the command 'node app'. If you are on windows, you can alternatively click the start.bat file
