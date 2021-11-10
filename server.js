const express = require("express");
const bodyParser = require("body-parser");
var nodemailer = require('nodemailer');
const app = express();
var https = require('https');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');

var wdata = [];

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/views/cWeather.html");

});

app.get("/contact", function(req, res) {
  res.sendFile(__dirname + "/views/contact_me.html");

});

app.post("/", function(req, res){

  const city = req.body.cityName;
  var unit = "imperial"
  const state = req.body.StateName;
  const apiKey = process.env.MY_KEY;
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

app.post("/contact", function(req, res){

  const name = req.body.fName;
  var email = req.body.email
  const message = req.body.message;
 
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'userusingapp@gmail.com',
      pass: 'Johnisbroke!1'
    }
  });
  
  var mailOptions = {
    from: 'userusingapp@gmail.com',
    to: 'batboy.john91@gmail.com',
    subject: name + ' ' + email,
    text: message
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

res.redirect("/contact");
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



const port = process.env.PORT || 8081;
      app.listen(port, () => {
        console.log("Server is listening on: ", port);
      });