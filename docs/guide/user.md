# profl.ink User
Note: All of these routes require authentication/must be logged in.

---

### View all Users
`GET /users/`

Returns a `JSON` of all User objects. This is accessible by all logged in users. Here is what is projected:

```
// Returned JSON
[{
  _id: '0' // assigned mongoose ID
  username: 'bobbyray',
  igUsername: 'bobby',
  twUsername: 'redditer',
  scUsername: 'phonelove',
  fbUsername: 'yelperdoe'
}]
```

### View one User
`GET /users/:username`

Returns a `JSON` of one(1) User object. This is accessible by all logged in users. Here is what is projected:

```
// Returned JSON
{
  _id: '0' // assigned mongoose ID
  username: 'bobbyray',
  igUsername: 'bobby',
  twUsername: 'redditer',
  scUsername: 'phonelove',
  fbUsername: 'yelperdoe'
}
```

### Update User
`PUT /users/:username`

Updates field(s) of a User object. Requester must be the same user. Example:

```
.put('https://api.profl.ink/users/bobbyray').send({
  username: 'bobbyflay',
  fbUsername: 'googlemapper'
});

```

### Delete User
`DELETE /users/:username`

Deletes a User object. Requester must be the same user. Example:

```
.delete('https://api.profl.ink/users/bobbyflay');

```

