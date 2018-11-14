# What is this API?
Profl.ink API is a helper API for the profl.ink website, a network of social networks.

---

## Getting Started
Use `https://api.profl.ink/` for all your routes. [Create](guide/authentication.md?id=new-user) a user, then use the [profl.ink user routes](guide/user.md) accordingly.

## User Object
`User` objects are the individual profl.inks with the following fields:

```
User = {
  username: String, // required, unique
  password: String, // required. encrypted
  fbUsername: String, // facebook
  igUsername: String, // instagram
  twUsername: String, // twitter
  scUsername: String, // snapchat
  isAdmin: Boolean // Admin claim, default false
}

```

---

### Original API Proposal
profl.ink is a proposed site for simple sharing of your daily social networks: Facebook, Instagram, Twitter, and Snapchat. It would create user accounts called _proflinks_ with their own specific url. Each personal url contains links for following their social media accounts.

The API would be built as a simple User structure, with authentication.

#### Stack {docsify-ignore}
Authentication would be built with JSONWebTokens and front end in React. (MERN)

#### Mockup/Prototype
A mockup/prototype was already built in react for simple user flow, see at https://profl.ink.
