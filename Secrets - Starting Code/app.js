require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose= require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");
const FacebookStrategy = require("passport-facebook").Strategy;

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

// For local sign in 
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Connect database
mongoose.set("strictQuery", false);
mongoose.connect('mongodb://127.0.0.1:27017/userDB');

// Create Schema
const userSchema = new mongoose.Schema({
    username: String,
    googleId: String,
    facebookId: String,
    secrets: {
        type: [String]
    }
});

// Add Plugins to the schema
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

// Create Collection
const User = new mongoose.model("User", userSchema);

//Local sign in
passport.use(User.createStrategy());

// Sessions workings for all type of authentification
passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.username, name: user.name });
    });
});
passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
    return cb(null, user);
    });
});

///////////////////////////////////////////////////////// SOCIAL AUTH STRATEGY /////////////////////////////////////////////////////////

// Google sign in
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    //console.log(profile);
    User.findOrCreate({
        username: profile.provider + profile.emails[0].value, 
        googleId: profile.id 
    }, 
    function (err, user) {
      return cb(err, user);
    });
  }
));

// FB sign in
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/secrets",
    profileFields: ['emails']
  },
  function(accessToken, refreshToken, profile, cb) {
    //console.log(profile);
    User.findOrCreate({ 
        username: profile.provider + profile.emails[0].value,
        facebookId: profile.id 
    }, function (err, user) {
      return cb(err, user);
    });
  }
));


////////////////////////////////////////////////////////////// ROUTES //////////////////////////////////////////////////////////////

app.get("/", function(req, res){
    res.render("home");
});

// Google routes
app.get("/auth/google", passport.authenticate('google', {
    scope: ["profile","email"]
}));
app.get("/auth/google/secrets", 
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
    // Successful authentication, redirect the secrets page.
    res.redirect('/secrets');
});

// FB routes
app.get("/auth/facebook", passport.authenticate('facebook', {
    scope: ["email"]
}));
app.get("/auth/facebook/secrets",
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect the secrets page.
    res.redirect('/secrets');
});


app.route("/login")
  .get(function(req, res){
    res.render("login");
  })
  .post(passport.authenticate("local"), function(req, res) {
        const user = new User({
            username: req.body.username,
            password: req.body.password     
        });
        req.login(user, function(err) {
            if(err) {
                console.log(err);
            } else {
                res.redirect("/secrets");
            }
        });
});

app.route("/register")
  .get(function(req, res){
    res.render("register");
})
  .post(function(req, res){
    User.register({username: req.body.username}, req.body.password, function(err, user){
        if (err){
            console.log('error registering user');
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secrets");
            });
        };
    });

});

app.get("/secrets", function(req, res){
    // This page is now public, people can see it without sign in 
    User.find({"secrets": {$ne: null}}, function(err, foundUsers){ // pick out the users where the secrets field != null
        if (err){
            console.log(err);
        } else {
            if (foundUsers){
                res.render("secrets", {usersWithSecrets: foundUsers});
            }
        }
    }) 
});


app.route("/submit")
  .get(function(req, res){
    if (req.isAuthenticated()){
        res.render("submit");
    } else {
        res.redirect("/login");
    }
  })
  .post(function(req, res){
    const submittedSecret = req.body.secret;

    console.log(req.user);

    User.findById(req.user.id, function(err, foundUser){
        if (err){
            console.log(err);
        } else {
            if (foundUser){
                console.log(foundUser);
                foundUser.secrets.push(submittedSecret);
                foundUser.save(function(){
                    res.redirect("/secrets");
                });
            }
        }
    })

  })

app.get("/logout", function(req, res){
    req.logout(function(err){
        if (err){
            return next(err);
        }
        res.redirect("/");
    });
});






app.listen(3000, function(req, res){
    console.log("Server started on port 3000.");
});