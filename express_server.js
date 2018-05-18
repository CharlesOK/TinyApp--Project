const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
const cookie-parser = require("cookie-parser");

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
  if(req.session) {
    var templateVars = {
      urls: urlsForUser(req.session.id),
      user: users[req.session.id],
    };
    console.log(urlDatabase)
    res.render("urls_index", templateVars);
 } else {

  }
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


app.get("/urls/:id", (req, res) => {
  if(req.session && req.session.id && urlDatabase[req.params.id].userId === req.session.id) {
    let templateVars = {
      shortURL: req.params.id,
      urls: urlDatabase,
      user : users[req.session.id]
    };
    res.render("urls_show", templateVars);
  } else if (req.session.id) {
    res.status(403).send("Sorry, you do not have permissions to change this URL");
  } else {
    res.status(403).send("Please Login First!");
  }
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
  res.redirect("/urls");
    });

  app.post('/login', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  console.log(req.body.username);
  if (username)
  for (name in users) {
    if (username === users[name].email) {
      if(bcrypt.compareSync(password, users[name].password) ) {
        req.session.id = users[name].id;
          res.redirect('/urls');
          return;
      } else {
        res.status(403).send ('Oops! Looks like you entered the wrong password!');
      return;
      }
    }
  }
  res.status(403).send('Are you sure you entered in your username and password correctly?')
});

  console.log(req.body);  // debug statement to see POST parameters
  res.redirect("/urls");         // Respond with 'Ok' (we will replace this)
});

app.post('/register', (req, res) => {
  const newEmail = req.body.email;
  const newPassword = bcrypt.hashSync(req.body.password, 10);
  if(req.body.password.length > 0 && newEmail.length > 0 && newPassword.length > 0 ) {
    for(key in users) {
      if(users[key].email === newEmail) {
        return res.status(400).send ('SORRY FRIEND! THIS EMAIL IS CURRENTLY REGISTERED!')
      }
    }
    let newId = generateRandomString();

    users[newId] = {
      id: newId,
      email: newEmail,
      password: newPassword
    };
    req.session.id = newId;
    console.log(users);
    return res.redirect('/urls');
  } else {
    res.status(400).send ('OOPS! LOOKS LIKE YOU MISSED A STEP!');
  }

});

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});