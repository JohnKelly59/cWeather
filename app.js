const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var https = require('https');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');
var config = require('./config');

var wdata = [];

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/cWeather.html");

});



app.post("/", function(req, res){

  const city = req.body.cityName;
  var unit = "imperial"
  const state = req.body.StateName;
  const apiKey = config.MY_KEY;
  var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city +"," + undefined + "&appid=" + apiKey + "&units=" + unit;

console.log(url);


  https.get(url, function(response) {
    console.log(response.statusCode);

    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const icon = weatherData.weather[0].icon;
      const desc = weatherData.weather[0].description;
      const fl = weatherData.main.feels_like;
      const tempMin = weatherData.main.temp_min;
      const tempMax = weatherData.main.temp_max;
      const humidity = weatherData.main.humidity;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

wdata.push(temp, desc, fl, tempMin, tempMax, humidity, imageURL);
res.redirect("/wdata");
    });
  });
});


app.get("/wdata", function (req,res){
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  var today  = new Date();
day = today.toLocaleDateString("en-US", options);

  res.render("info",{kindofday: day, winfo : wdata});

});


app.post("/wdata", function(req, res) {
wdata = []
  res.redirect("/");
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
