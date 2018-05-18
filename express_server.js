const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");

//define middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  let randomString = "";
  let newString = "abcdefghijkl5896yiuy3ght";
  for(var i = 0; i < 5; i++) {
    var random = Math.floor(Math.random() * newString.length - 1);
    randomString += newString[random];
  }
  return randomString;
}
app.get("/urls", (req, res) => {
  let templateVars = {urls: urlDatabase};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
let longURL = urlDatabase[req.params.shortURL].longURL;
  console.log(req.params);
  res.redirect(longURL);
});


app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.post("/urls", (req, res) => {
  let longURL = req.body.longURL;
  let newShortUrl = generateRandomString();
  urlDatabase[newShortUrl] = longURL;
  res.redirect('/urls');
});


app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  var longURL = req.body.longURL;
  urlDatabase[req.params.id] = {
    longURL: req.body.longURL,
    userId: req.session.id

  };
  console.log(req.body);  // debug statement to see POST parameters
  res.redirect("/urls");         // Respond with 'Ok' (we will replace this)
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});