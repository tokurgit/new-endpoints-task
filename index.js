const express = require('express');
const app = express();
const axios = require('axios');
const fs = require('fs');

const url = "https://api.coindesk.com/v1/bpi/currentprice.json";

app.get('/', function (req, res)
{
  res.send('Hello, World!');
});

const getData = async (url) =>
{
  try
  {
    const response = await axios.get(url);
    return response.data;
  } catch (error)
  {
    console.log(error);
  }
};
//BTC PRICE ENDPOINT
app.get('/btc', function (req, res)
{
  getData(url)
    .then((result) => res.send("Price of BTC is " + result.bpi.EUR.rate + " EUR"));
});
//CAPITAL CITY ENDPOINT
app.get('/capital/:country', function (req, res)
{

  let capitalCities = fs.readFileSync('node_modules/country-json/src/country-by-capital-city.json', 'utf8',
    (err, data) => 
    {
      if (err) throw err;
      return data;
    });

  let searchValue = req.params.country.toLowerCase();
  let searchField = "country";
  let searchCapitalCityField = "city";
  let parsedCollection = JSON.parse(capitalCities);
  let capitalCity;

  for (let i = 0; i < parsedCollection.length; i++) 
  {
    let searchCountry = parsedCollection[i][searchField].toLowerCase();
    if (searchCountry == searchValue)
    {
      capitalCity = parsedCollection[i][searchCapitalCityField];
    }
  }

  res.send("Capital city of Latvia is " + capitalCity);
});

app.listen(3000);