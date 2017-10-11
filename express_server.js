const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require('body-parser');
const randomstring = require("randomstring");

//implement a function that produces a string of 6 random alphanumeric characters
function generateRandomString() {
  return randomstring.generate(6);
}
// console.log(generateRandomString('x'));

//The body-parser library will allow us to access POST request parameters
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');

let urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

app.get('/', (req, res) => {
  res.end('Hello!');
});

app.get('/urls', (req, res) => {
  let templateVars = {
    urls: urlDatabase
  };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

app.get('/urls/:id', (req, res) => {
  let shortURL = req.params.id;
  let longURL = urlDatabase[shortURL]
  let templateVars = {
    shortURL,
    longURL
  };

  res.render('urls_show', templateVars);
});

app.post('/urls', (req, res) => {
  console.log(req.body); // debug statement to see POST parameters
  let shortURL = generateRandomString(req.body);
  let longURL = req.body.longURL;
  console.log(shortURL)
  urlDatabase[shortURL] = longURL;
  console.log(urlDatabase);
  res.redirect('urls/' + shortURL); // Respond with 'Ok' (we will replace this)
});

app.get("/u/:shortURL", (req, res) => {
  // let longURL = ...
  let shortURL = req.params.shortURL;
  let longURL =  urlDatabase[shortURL]
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});