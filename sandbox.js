var users = {

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

var testStr = "user@example.com"

for (i in users){

  console.log("users[i].email = " + users[i].email + " " + testStr);
  console.log("users[i].email = " + (users[i].email === testStr));

//   if (user[i].email === testStr){
//   console.log("users[i].email = ", users[i].email);
// }

}