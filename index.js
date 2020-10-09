const express = require('express');
const app = express();
const axios = require('axios');

const url = "https://api.coindesk.com/v1/bpi/currentprice.json"

app.get('/', function (req, res) {
  res.send('Hello, World!');
});

const getData = async (url) => {
  try {
    const response = await axios.get(url)
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

app.get('/btc', function (req, res) {
  getData(url)
    .then((result) => res.send("Price of BTC is " + result.bpi.EUR.rate + " EUR"));
})



app.listen(3000);
