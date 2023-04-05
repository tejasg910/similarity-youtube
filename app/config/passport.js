const passport = require("passport");
const User = require("../models/User");

const LocalStratergy = require("passport-local").Strategy;
const bycrypt = require("bcrypt");
function initialize(passport) {
  passport.use(
    new LocalStratergy(
      { usernameField: "email" },
      async (email, password, done) => {
        //check if email exists
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, { mssage: "no user with this email" });
        }

        const matched = bycrypt
          .compare(password, user.password)
          .then((match) => {
            if (match) {
              return done(null, user, { message: "Logged in successfully" });
            }
            return done(null, false, { message: "Invalid credentials" });
          })
          .catch((err) => {
            return done(null, false, { message: "Something went wrong " });
          });
      }
    )
  );

  passport.serializeUser((user, done) => {
    //what to store in the session this callback decides

    //the user came from done

    //the second parament decides what to store in session
    done(null, user._id);
  });
}

//we are getting the data from the session in deserilaize

passport.deserializeUser(async (id, done) => {
  //first paramenter is data is stored in session
  const { data } = await User.findById(id);

  if (data) {
    req.user = data;

    done(null, data);
  }
});

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const googleAuthenticate = async (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        scope: ["profile", "email"],
      },
      async function (accessToken, refreshToken, profile, done) {
        // Callback function to handle successful authentication
        // You can store user information in the database or create a new user
        if (!profile.emails) {
          return done("No email found", false);
        }
        const user = await User.findOne({ email: profile.id });
        if (user) {
          // User already ists in the database, return the user
          return done(null, user);
        } else {
          // User does not exist in the database, create a new user

          const newUser = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
          });
          newUser.save((err) => {
            if (err) {
              return done(err);
            }
            return done(null, newUser);
          });
        }

        // return cb(null, profile);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};

module.exports = { initialize, googleAuthenticate };
