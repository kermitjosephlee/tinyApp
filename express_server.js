var express = require("express");
var app = express();
var cookieParser = require('cookie-parser');
var PORT = 8080;

var urlDatabase = {
  "b2xVn2": "http://www.lighthouse.ca",
  "9sm5xL": "http://www.google.com",
};

const users = {

  "userRandomID": {
      id: "userRandomID",
      email: "user@example.com",
      password: "purple-monkey-dinosaur"
    },
   "user2RandomID": {
      id: "user2RandomID",
      email: "user2@example.com",
      password: "dishwasher-funk"
    }
};

function generateRandomString(){
  let tempStr = "";
  let stringLength = 6
  let possibleLetters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < stringLength; i++){
      tempStr += possibleLetters.charAt(Math.floor(Math.random() * possibleLetters.length));
    }
    return tempStr;
};

function loginValidator (loginEmail, loginPassword){

  for (let i in users){
    if (users[i].email === loginEmail){
      if (users[i].password === loginPassword) {
        return users[i];
      } else {
        return false;
      }
    }
  }
  return false;
};


app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());


app.use(function (req, res, next) {
  console.log("");
  console.log("**  TOP  *********************************");
  console.log(req.method + ": " +req.path);
  console.log("cookies:", req.cookies);
  console.log('- - - - - - - - - - - - - -');
  console.log("req.body.email:", req.body.email);
  console.log('- - - - - - - - - - - - - -');
  console.log("USERS:", users);
  console.log('- - - - - - - - - - - - - -');
  console.log("urlDB:", urlDatabase);
  console.log("- - - - - - - - - - - - - -");
  console.log("loginValidator: ", loginValidator(req.body.email));
  console.log("- - - - - - - - - - - - - -");
  console.log('########################  END  ############');
  next();
});



app.get("/", (req, res) => {
  let user = users[req.cookies["user_id"]];
  let templateVars = { urls: urlDatabase, user: user };
  res.render("url_index", templateVars)
});

app.get("/urls", (req, res) => {
  let user = req.cookies["user_id"];
  let templateVars = { urls: urlDatabase, user: user };
  res.render("url_index", templateVars)
});

app.get("/login", (req, res) => {
  let user = users[req.cookies["user_id"]];
  let templateVars = { urls: urlDatabase, user: user };
  res.render("url_login", templateVars)
})

app.get("/urls/new", (req, res) => {
  let user = users[req.cookies["user_id"]];
  let templateVars = { urls: urlDatabase, user: user };
  res.render("url_new", templateVars);
});

app.get("/register", (req, res) => {
  let user = users[req.cookies["user_id"]]
  let templateVars = { urls: urlDatabase, user: user };
  res.render("url_register", templateVars)
});

app.post("/register", (req, res) => {

  if (req.body.email && req.body.password){

    let randomId = generateRandomString();
    let userObj = { id: randomId, email: req.body.email, password: req.body.password };
    users[randomId]= userObj;
    res.cookie("user_id", randomId)
    res.redirect("/urls");
  } else {
    res.redirect("/error");
  }

});

app.post("/login", (req, res) => {
  console.log('req.body.email 2', req.body.email)
  let foundUser = loginValidator(req.body.email, req.body.password);
  if (req.body.email && req.body.password && foundUser){
    res.cookie('user_id', foundUser.id);
    res.redirect("/");

  } else {
    res.redirect("/error");
  }

});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
})

app.post("/urls", (req, res) => {
  let tempStr = generateRandomString();
  urlDatabase[tempStr] = req.body.longURL;
  let templateVars = { urls : urlDatabase };
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
  let user = users[req.cookies["user_id"]];
  let templateVars = { shortURL: req.params.id, user: user};
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

app.get("/error", (req, res) => {
  res.status(403).send();
})

app.listen(PORT, () => {
  console.log('Example app listening on port ${PORT}!');
});