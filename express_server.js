var express = require("express");
var app = express();
var PORT = 8080;

var urlDatabase = {
  "b2xVn2": "http://www.lighthouse.ca",
  "9sm5xL": "http://www.google.com",
};

function generateRandomString(){
  let tempStr = "";
  let possibleLetters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 6; i++){
      tempStr += possibleLetters.charAt(Math.floor(Math.random() * possibleLetters.length));
    }
    return tempStr;
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
  res.render("url_index", templateVars)
});

app.get("/urls/new", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("url_new", templateVars);
});

app.post("/urls", (req, res) => {
  let tempStr = generateRandomString();
  urlDatabase[tempStr] = req.body.longURL;
  let templateVars = { urls : urlDatabase };
  console.log("URLDB:", urlDatabase)
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  let templateVars = { urls: urlDatabase };
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  let templateVars = { urls: urlDatabase};
  res.redirect("/urls");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id };
  res.render("url_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
})

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log('Example app listening on port ${PORT}!');
});