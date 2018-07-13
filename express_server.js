var express = require("express");
var app = express();
var cookieParser = require('cookie-parser');
var PORT = 8080;


const users = {

  "userRandomID": {
      id: "userRandomID",
      email: "user@example.com",
      password: "qwe"
    },
   "user2RandomID": {
      id: "user2RandomID",
      email: "user2@example.com",
      password: "123"
    }
};


var urlDatabase = {

  "b2xVn2": { "b2xVn2": "http://www.lighthouse.ca", "userRandomID": users.id},
  "9sm5xL": { "9sm5xL": "http://www.google.com","user2RandomID": users.id},

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
  console.log("req.body:", req.body);
  console.log('- - - - - - - - - - - - - -');
  console.log("USERS:", users);
  console.log('- - - - - - - - - - - - - -');
  console.log("urlDB:", urlDatabase);
  console.log("- - - - - - - - - - - - - -");
  console.log('########################  END  ############');
  next();
});



// created variable "userID" to pull user_id from cookie
// user assigned specific user obj from users
// email address would be user.email
app.get("/", (req, res) => {
  let userID = req.cookies.user_id;
  let user = users[userID];
  let templateVars = { urlDatabase: urlDatabase, user: user };
  res.render("url_index", templateVars)
});

// created variable "userID" to pull user_id from cookie
// "user" assigned specific user obj from users
// email address would be user.email
app.get("/urls", (req, res) => {
  let userID = req.cookies.user_id
  let user = users[userID];
  let templateVars = { urlDatabase: urlDatabase, user: user };
  res.render("url_index", templateVars)
});

// user is defined the "user_id" in the req.cookies within object users
// templateVars is the key value pairs of variables passed to EJS
// res.render is the call to express to send "url_login.ejs" with the data contained in obj templateVars
// app.get is the express function call that accepts parameters "/login", and req (request) and res (result)
app.get("/login", (req, res) => {
  let user = users[req.cookies["user_id"]];
  let templateVars = { urlDatabase: urlDatabase, user: user };
  res.render("url_login", templateVars)
})


// get takes user which we define as name "user_id" from req.cookies from object users
// we create an object called templateVar which EJS will see as the object of urlDatabase (left side) which we assign the value of object urlDatabase (right side)
// express then renders "url_new" with this information and renders it at location /urls/new
app.get("/urls/new", (req, res) => {
  let user = users[req.cookies["user_id"]];
  let foundUser = loginValidator(req.body.email, req.body.password);

  if (req.body.email && req.body.password && foundUser){
    res.cookie('user_id', foundUser.id);
    let templateVars = { urlDatabase: urlDatabase, user: user };
    res.render("url_new", templateVars);

  } else {
    res.redirect("/login");
  }

});

app.get("/register", (req, res) => {
  let user = users[req.cookies["user_id"]]
  let templateVars = { urlDatabase: urlDatabase, user: user };
  res.render("url_register", templateVars)
});


// the app.post function call to register is designed to check to see if there are values in req.body.email and req.body.password and if the && boolean is satisfied, it will call on the generateRandomString function to return a randomized string.
// we then define a new object called userObj defined as below (id: ,email:, password:, )
// we then assign to the users object with a id key as the randomId with the userObj object
// we then redirect the page to /urls

// if the && boolean returns false, the page is redirected to the error page

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


// when post login route is executed, first for testing purposes it will console.log that req.body.email has received the email string from the page.
// we then define a variable called foundUser which will store the results of the calling of the function loginValidator. To start loginValidator, it will need the email and the password entered into the page
// to check to see if there is an email and password combination in the users object, we check to see first if there are non-zero entries for req.body.email and req.body.password. We also check to see if foundUser has returned with a positive result from checking the email and password against the users object.
// if all of these are satisfied, we create a cookie called user_id which will retain the randomized string id value, referenced as foundUser.id
// we then redirect the page back to root
// if the logic gate is not satisfied, we redirect to error
app.post("/login", (req, res) => {
  let foundUser = loginValidator(req.body.email, req.body.password);
  if (req.body.email && req.body.password && foundUser){
    res.cookie('user_id', foundUser.id);
    res.redirect("/");

  } else {
    res.redirect("/login");
  }

});

// when post logout is called, we call on the clearCookie function to clear cookie with name user_id
// we then redirect to root
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/");
})

// post urls starts with a local variable tempStr be defined as a random string created by the generateRandomString function
// we then add to the urlDatabase object with the key of tempStr and value of the req.body.longURL
// we then redirect to /urls
app.post("/urls", (req, res) => {
  let tempStr = generateRandomString();
  urlDatabase[tempStr] = req.body.longURL;
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
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

app.get("/error", (req, res) => {
  res.status(403).send();
})

app.listen(PORT, () => {
  console.log('Example app listening on port ${PORT}!');
  console.log("ooo eee can do!");
});