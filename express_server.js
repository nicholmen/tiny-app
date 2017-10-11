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

//The body-parser library will allow us to access POST body =
app.use(bodyParser.urlencoded({
  extended: true
}));

// accessing embedded javascript (ejs) templating engine
app.set('view engine', 'ejs');

let urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};


// upon a get request to our homepage, respond with 'Hello!' on the homepage:
app.get('/', (req, res) => {
  return res.end('Hello!');
});


// upon a get request to /urls, sends the rendered html of our urls_index ejs file (where our URLs are displayed) to the client
app.get('/urls', (req, res) => {
  let templateVars = {
    urls: urlDatabase
  };
  return res.render('urls_index', templateVars);
});


/**
 * upon a get request to urls/new, sends the rendered html of our urls_new page which contains a form to submit a new URL
 * 
 * id - ....
 * 
 */
app.get('/urls/new', (req, res) => {
  return res.render('urls_new');
});


// upon a get request to urls/< a generated 6 digit random string >, renders our urls_show ejs file which displays a long url and its corresponding random string
app.get('/urls/:id', (req, res) => {
  let shortURL = req.params.id;
  let longURL = urlDatabase[shortURL]
  let templateVars = {
    shortURL,
    longURL
  };

  return res.render('urls_show', templateVars);
});


// AUTHENTICSTION MIDDLEWARE - (eg) checks the cookie session to make sure the user is logged in, if not logged in redirects to the login page.. to implement: e.g. app.post('/urls', isAuthenticated, (req, res) =>
// function isAuthenticated (res, req, next) {
//   if (req.sesssion......)
//     return res.redirect('/login')
//    else

//    res.locals.user= .....
//     return next();
// }


// upon a post request to /urls, redirect to urls/< the 6 digit random string generated to represent a given URL>
app.post('/urls', (req, res) => {
  console.log(req.body); // debug statement to see POST parameters
  let shortURL = generateRandomString(req.body);
  let longURL = req.body.longURL;
  console.log(shortURL)
  urlDatabase[shortURL] = longURL;
  console.log(urlDatabase);
  return res.redirect('urls/' + shortURL); 
});


//upon a POST request to /urls/:id/delete, remove the shortened URL and then redirect the client back to the urls_index page at /urls
app.post("/urls/:id/delete", (req, res) => {
  shortURL = req.params.id;

  delete urlDatabase[shortURL];
  return res.redirect('/urls')
})


//upon a get request to /u/< one of our 6 digit short URLs>, redirect to the corresponding long UIRL
app.post("/u/:shortURL", (req, res) => {
  // let longURL = ...
  let shortURL = req.params.shortURL;
  let longURL =  urlDatabase[shortURL]
  return res.redirect(longURL);
});


// initiate server to listen for connections on the specified host and port.
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});