var express = require("express");
var app = express();
var PORT = 8080;

var urlDatabase = {
  "b2xVn2": "http://www.lighthouse.ca",
  "9sm5xL": "http://www.google.com",
};

app.set("view engine", "ejs");



app.get("/", (req, res) => {
  res.render('pages/index')
});

app.get("/about", (req, res) => {
  res.render('pages/about')
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log('Example app listening on port ${PORT}!');
});