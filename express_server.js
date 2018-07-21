const express = require("express");
const app = express();
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const PORT = 8080;

//************************************************************

const users = {};

const urlDatabase = {
  "userRandomID":   { "b2xVn2": "http://www.lighthouse.ca", "asdfed": "http://www.yahoo.com",},
  "user2RandomID":  { "9sm5xL": "http://www.google.com", },
};

//************************************************************

function generateRandomString(){
  let tempStr = "";
  const stringLength = 6
  const possibleLetters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < stringLength; i++){
      tempStr += possibleLetters.charAt(Math.floor(Math.random() * possibleLetters.length));
    }
    return tempStr;
};

function loginValidator (loginEmail, loginPassword){

  for (let userId in users){
    const user = users[userId];

    if (user.email === loginEmail){
      if (bcrypt.compareSync(loginPassword, user.password)) {
        return user;
      } else {
        return false;
      }
    }
  }
  return false;
};

function collectionOfUserIDVariables (req){

  const userID = req.session.user_id;
  const user = users[userID];

  return [userID, user]
}

//************************************************************

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

//************************************************************

app.get("/", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];
  const templateVars = { urlUserDb: urlDatabase[userID], user: user };
  res.render("url_index", templateVars)
});

function postURLS (req, res){

  const userID = req.session.user_id;
  const user = users[userID];
  if (user) {
    const tempStr = generateRandomString();
    urlDatabase[userID][tempStr] = req.body.longURL;
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
};

app.get("/urls", (req, res) => {
  authorizedAction(req, res, function (user){
    const templateVars = { urlUserDb: urlDatabase[user.id], user: user,shortURL: req.params.shortURL};
    res.render("url_index", templateVars);
  });
});

app.post("/urls", (req, res) => {
  postURLS(req, res);
});

function authorizedAction(req, res, doIfAuthorized){
  const userID = req.session.user_id;
  const user = users[userID];
  if (user) {
    doIfAuthorized(user);
  } else {
    res.redirect("/login");
  }
};

app.get("/urls/new", (req, res) => {
  authorizedAction(req, res, function(user){
    let templateVars = { user: user };
    res.render("url_new", templateVars);
  });
});

app.get("/register", (req, res) => {
  const userID = req.session.user_id;
  const user = users[req.session["user_id"]]
  const templateVars = { urlUserDb: urlDatabase[userID], user: user };
  res.render("url_register", templateVars)
});

app.post("/register", (req, res) => {
  if (req.body.email && req.body.password){
    const randomId = generateRandomString();
    const encryptedPassword = bcrypt.hashSync(req.body.password, saltRounds);
    const userObj = { id: randomId, email: req.body.email, password: encryptedPassword };
    users[randomId]= userObj;
    urlDatabase[randomId] = {};
    res.cookie("user_id", randomId);
    res.redirect("/urls");
  } else {
    res.redirect("/error");
  }
});

app.get("/login", (req, res) => {
  const userID = req.session.user_id;
  const user = users[req.session["user_id"]];
  const templateVars = { urlUserDb: urlDatabase[userID], user: user };
  res.render("url_login", templateVars);
});

app.post("/login", (req, res) => {
  const foundUser = loginValidator(req.body.email, req.body.password);
  if (req.body.email && req.body.password && foundUser){
    req.session.user_id = foundUser.id;
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});

app.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect("/");
})

app.get("/urls/:shortURL", (req, res) => {
  const userID = req.session.user_id;
  const user = users[req.session["user_id"]];
  const templateVars = { urlUserDb: urlDatabase[userID] , user: user, shortURL: req.params.shortURL};
  res.render("url_show", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
  const userID = req.session.user_id;
  const shortURL = req.params.shortURL;
  const urlUserDb = urlDatabase[userID];
  urlUserDb[shortURL] = req.body.longURL
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = findLongURL(urlDatabase, shortURL);
  if (longURL !== null){
    res.redirect(longURL);
  } else {
    res.redirect("/error");
  }
});

function findLongURL (urlDatabase, testURL){
  let longURL = null;
  for (user in urlDatabase){
    for (shortURLKey in urlDatabase[user]){
      if (testURL === shortURLKey){
        longURL = urlDatabase[user][shortURLKey];
      }
    }
  }
  return longURL;
};

app.post("/urls/:shortURL/delete", (req, res) => {
  console.log("req.params.shortURL: ", req.params.shortURL);
  const userID = req.session.user_id;
  delete urlDatabase[userID][req.params.shortURL];
  res.redirect("/urls");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/error", (req, res) => {
  res.status(403).send();
})

//************************************************************

app.listen(PORT, () => {
  console.log('Example app listening on port ${PORT}!');
  console.log("ooo eee can do!");
});