var express = require("express");
var app = express();
var PORT = 8080;



var urlDatabase = {
  "b2xVn2": "http://www.lighthouse.ca",
  "9sm5xL": "http://www.google.com",
};

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("url_index", templateVars)
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("views/url_index", templateVars)
});

app.get("/urls/new", (req, res) => {
  res.render("url_new");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id };
  res.render("url_show", templateVars);
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