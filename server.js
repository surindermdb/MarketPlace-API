var  express = require('express');
const session = require('express-session');
const passport = require('passport');  // authentication
const LocalStrategy = require("passport-local").Strategy;
var  cors = require('cors');
var  app = express();
var  router = express.Router();

const {userColl} = require('./api/models/user'); // User Model

// Configure Sessions Middleware
app.use(session({
  secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public')); 

app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy
// passport.use(userColl.createStrategy());
const local = new LocalStrategy((username, password, done) => {
  userColl.findOne({ username })
    .then(user => {
      if (!user || !user.validPassword(password)) {
        done(null, false, { message: "Invalid username/password" });
      } else {
        done(null, user);
      }
    })
    .catch(e => done(e));
});

passport.use("local", local);

// To use with sessions
passport.serializeUser(userColl.serializeUser());
passport.deserializeUser(userColl.deserializeUser());

// To read images from API for frontend 
app.use('/images', express.static('images'));

app.use(require('./api/init/routes')); // Initilized routes where setup API path

router.use((request, response, next) => {
  next();
});

var  port = process.env.PORT || 3002;
app.listen(port);
console.log('Order API is runnning at ' + port);

