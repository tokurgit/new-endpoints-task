const express = require('express');
const app = express();
const axios = require('axios');
const fs = require('fs');
const { getXlsxStream } = require('xlstream');
const multer = require('multer');
const url = "https://api.coindesk.com/v1/bpi/currentprice.json";

app.get('/', function (req, res)
{
  res.send('Hello, World!');
});


//BTC PRICE GET ENDPOINT
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

app.get('/btc', (req, res) =>
{
  getData(url)
    .then((result) => res.send("Price of BTC is " + result.bpi.EUR.rate + " EUR"));
});

//CAPITAL CITY ENDPOINT
app.get('/capital/:country', (req, res) =>
{
  let searchValue = req.params.country.toLowerCase();
  let searchField = "country";
  let searchCapitalCityField = "city";
  let capitalCity;
  let country;
  let message;

  fs.readFile('node_modules/country-json/src/country-by-capital-city.json', 'utf8',
    (err, data) => 
    {
      if (err)
      {
        throw err;
      }
      else
      {
        let parsedData = JSON.parse(data);
        for (let i = 0; i < parsedData.length; i++) 
        {
          let searchCountry = parsedData[i][searchField].toLowerCase();
          if (searchCountry == searchValue)
          {
            country = parsedData[i][searchField];
            capitalCity = parsedData[i][searchCapitalCityField];
            message = `Capital city of ${country} is ${capitalCity}`;
            break;
          }
          else
          {
            message = "We couldn't find such a country";
          }
        }
        res.send(message);
      }
    });
});

//EXCEL SUM POST ENDPOINT
var storage = multer.diskStorage({
  destination: function (req, file, cb)
  {
    cb(null, __dirname + '/uploads/');
  },
  filename: function (req, file, cb)
  {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
var upload = multer({
  storage: storage
});

app.post('/excel-sum', upload.single('file'), async (req, res) =>
{
    const stream = await getXlsxStream({
      filePath: req.file.path,
      sheet: 0,
    });
    let dataArr = [];
    stream.on('data', x => dataArr.push(x.raw.obj.A)),
      stream.on('end', () => res.send(`SUM is ${dataArr.reduce((a, b) => a + b)}`));
});

app.listen(3000);
