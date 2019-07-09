const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer();
const passwordsAssoc = {};
let attempts = {};

const loginHtml = `
<form action="/login" method="POST" enctype="multipart/form-data">        
  <div>Username</div>        
  <input type="text" name="username"></input>        
  <div>Password</div>        
  <input type="text" name="password"></input>        
  <input type="submit" value="log me in!"></input>        
</form>
`;

app.use('/', express.static(__dirname + '/public'));

app.post('/signup', upload.none(), (req, res) => {
  console.log('/signup hit', req.body);
  let username = req.body.username;
  let password = req.body.password;
  if (passwordsAssoc[username]) {
    return res.send('<html><body> Username taken </body></html>');
  }
  passwordsAssoc[username] = password;
  res.send('<html><body> signup successful </body></html>');
});

app.post('/login', upload.none(), (req, res) => {
  console.log('/login hit', req.body);
  let username = req.body.username;
  let passwordGiven = req.body.password;
  let expectedPassword = passwordsAssoc[username];
  if (passwordsAssoc[username] === undefined) {
    return res.send('<html><body> No such account </body></html>');
  }
  if (attempts[username] >= 2) {
    return res.send('<html><body> Account disabled </body></html>');
  }
  if (expectedPassword !== passwordGiven) {
    // if (attempts[username] === undefined) {
    //   attempts[username] = 1;
    // } else {
    //   attempts[username]++;
    // }
    attempts[username] = attempts[username] ? attempts[username] + 1 : 1;
    return res.send(
      `<html>
      <body>
      invalid username or password
      <a href="/">Go back</a>
      ${loginHtml}
      </body>
      </html>`
    );
  }
  attempts[username] = 0;
  res.send('<html><body> login successful </body></html>');
});
app.listen(4000, () => {
  console.log('server started');
});
