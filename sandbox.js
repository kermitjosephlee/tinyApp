const urlDatabase = {
  "userRandomID":   { "b2xVn2": "http://www.lighthouse.ca", "asdfed": "http://www.yahoo.com",},
  "user2RandomID":  { "9sm5xL": "http://www.google.com", },
};

const testURL = "b2xVn2";

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
}
