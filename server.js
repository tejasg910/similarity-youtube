require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const session = require("express-session");

const PORT = process.env.PORT || 8000;
const ejs = require("ejs");

const flash = require("express-flash");
const expressEjsLayouts = require("express-ejs-layouts");
const connectDB = require("./config/connectDB");
const User = require("./app/models/User");
const initRoutes = require("./routes/web");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const init = require("./app/config/passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParser());

// Event emitter
const EventEmitter = require("events");
const eventEmitter = new EventEmitter();
app.set("eventEmitter", eventEmitter);
//session config

app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

const { initialize, googleAuthenticate } = require("./app/config/passport");
initialize(passport);
googleAuthenticate(passport);

app.use(passport.initialize());

app.use(passport.session());

app.use(flash());

//set template engine
connectDB();
app.use(expressEjsLayouts);
//seting views dir
app.set("views", path.join(__dirname, "/resource/views"));
app.set("view engine", "ejs");
app.use(express.urlencoded());
app.use(express.json());
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});
initRoutes(app);

const server = app.listen(8000, () => {
  console.log("server started on port ", PORT);
});

//socket connection

const io = require("socket.io")(server);
io.on("connection", (socket) => {
  socket.on("join", (orderId) => {
    //join event and socket join function are different do not get confused

    socket.join(orderId);
  });
  //we are creating the private rooms for that we need the unique clients and the name so we will get it through the client
});

eventEmitter.on("orderUpdated", (data) => {
  io.to(`order_${data.id}`).emit("orderUpdated", data);
});

eventEmitter.on("orderPlaced", (data) => {
  io.to("adminRoom").emit("orderPlaced", data);
});
