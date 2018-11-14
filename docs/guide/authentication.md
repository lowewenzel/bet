## Authentication
---
### New User
`POST /auth/new`

Takes a JSON `req.body` argument of a new user. Returns the `jwt` token to the cookie.

```
.post('https://api.profl.ink/auth/new').send({
  username: 'bobbyflay',
  password: 'plaintextfornow',
  fbUsername: 'bobbyflay',
  igUsername: 'bobbyflayIG',
  twUsername: 'bobbystwitter',
});

```

#### Login User
`POST /auth/login`

Takes a JSON `req.body` argument of a user `username` and `password`.

```
.post('https://api.profl.ink/auth/login').send({
  username: 'bobbyflay',
  password: 'plaintextfornow',
});

```

#### Logout User
`POST /auth/logout`

Removes current token

```
.post('https://api.profl.ink/auth/logout');

```