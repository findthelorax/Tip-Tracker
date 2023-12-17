
Passport.js Initialization: You need to initialize Passport.js and the express session middleware in your main server file (usually app.js or server.js).

Login Route: You need a route for users to log in. This route should use the passport.authenticate middleware.

Logout Route: You need a route for users to log out.

Authentication Check: You should have middleware to check if a user is authenticated before they can access certain routes.

Passport.js Strategies: Passport.js uses the concept of strategies to authenticate requests. You're using the local strategy in your code, but there are other strategies for OAuth, JWT, etc.

User Model: Your User model should have a method to validate the password. You have this in your code (UserSchema.methods.verifyPassword), but it's worth mentioning.

Session Secret: The session secret used in express-session should be stored securely and not be exposed in your code. Consider storing it in an environment variable.

Error Handling: You should handle errors that might occur during the authentication process, such as database errors.

Form Handling: Your login and registration forms should use a POST method to submit the data to the server.

Password Hashing: You're already doing this in your UserSchema.pre('save') middleware, but it's an important part of authentication to mention.

Remember, security is a complex field and this is just a basic setup. Depending on your application, you might need to consider other factors like rate limiting, CSRF protection, and more.


To implement authentication using Passport.js in your Express.js application, you'll need to follow these steps:

Install the necessary packages: passport, passport-local, and express-session.

Set up Passport.js in your Express.js application.

Define a local strategy for Passport.js.

Serialize and deserialize user instances to and from the session.

Use Passport.js middleware in your routes.

Here's how you can do it:

In this code, passport.authenticate('local') is a middleware that uses the local strategy to authenticate users. If authentication is successful, the user is redirected to the '/admin' route. If authentication fails, the user is redirected to the '/login' route.

```
// Import necessary packages
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');
const User = require('../models/users'); // Assuming you have a User model

const app = express();

// Set up express session
app.use(expressSession({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Define local strategy for Passport
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      const isValidPassword = await user.verifyPassword(password);
      if (!isValidPassword) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Use Passport.js in your routes
app.post('/login', passport.authenticate('local', { successRedirect: '/admin', failureRedirect: '/login' }));
```

// const rateLimit = require('express-rate-limit');
// const { body, validationResult } = require('express-validator');
// const loginLimiter = rateLimit({
// 	windowMs: 15 * 60 * 1000, // 15 minutes
// 	max: 100 // limit each IP to 100 requests per windowMs
//   });
//   router.post('/login', loginLimiter, [
// 	body('username').isLength({ min: 3 }),
// 	body('password').isLength({ min: 5 })
//   ], async (req, res) => {
// 	const errors = validationResult(req);
// 	if (!errors.isEmpty()) {
// 	  return res.status(400).json({ errors: errors.array() });
// 	}

// 	const { username, password } = req.body;

// 	try {
// 	  const user = await User.findOne({ username });

// 	  if (!user) {
// 		return res.status(400).json({ error: 'Invalid username or password' });
// 	  }

// 	  const passwordMatch = await bcrypt.compare(password, user.password);

// 	  if (!passwordMatch) {
// 		return res.status(400).json({ error: 'Invalid username or password' });
// 	  }

// 	  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

// 	  res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });
// 	  res.json({ username: user.username, message: 'Login successful' });
// 	} catch (err) {
// 	  res.status(500).json({ error: 'Server error' });
// 	}
//   });

//   router.post('/signup', [
// 	body('username').isLength({ min: 3 }),
// 	body('password').isLength({ min: 5 })
//   ], async (req, res) => {
// 	const errors = validationResult(req);
// 	if (!errors.isEmpty()) {
// 	  return res.status(400).json({ errors: errors.array() });
// 	}

// 	const { username, password } = req.body;

// 	try {
// 	  const hashedPassword = await bcrypt.hash(password, 10);

// 	  const user = new User({
// 		username,
// 		password: hashedPassword,
// 	  });

// 	  await user.save();

// 	  res.status(201).json({ message: 'User created successfully' });
// 	} catch (err) {
// 	  res.status(500).json({ error: 'Server error' });
// 	}
//   });

const { check, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');

app.post('/register', [
  check('username').isLength({ min: 5 }),
  check('email').isEmail(),
  check('password').isLength({ min: 5 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Sanitize input
  req.body.username = sanitizeHtml(req.body.username);
  req.body.email = sanitizeHtml(req.body.email);

  // Your code here
});

Protecting Routes
You can use middleware to protect routes. Here's an example of a middleware function that checks if a user is authenticated:

function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    return res.status(401).send('You must be logged in to view this page');
  }
}

// Use the middleware in your routes
app.get('/profile', isAuthenticated, (req, res) => {
  // Your code here
});


You can use libraries like express-validator and sanitize-html to validate and sanitize user input:

const { check, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');

app.post('/register', [
  check('username').isLength({ min: 5 }),
  check('email').isEmail(),
  check('password').isLength({ min: 5 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Sanitize input
  req.body.username = sanitizeHtml(req.body.username);
  req.body.email = sanitizeHtml(req.body.email);

  // Your code here
});