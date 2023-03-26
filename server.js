const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 8000;
const ejs = require("ejs");
console.log(__dirname);

const expressEjsLayouts = require("express-ejs-layouts");
const connectDB = require("./config/connectDB");
const User = require("./modals/User");
const initRoutes = require("./routes/web");
app.use(express.static(path.join(__dirname, "/public")));

//set template engine
connectDB();
app.use(expressEjsLayouts);
//seting views dir
app.set("views", path.join(__dirname, "/resource/views"));
app.set("view engine", "ejs");
app.use(express.urlencoded());
initRoutes(app);

app.listen(8000, () => {
  console.log("server started on port ", PORT);
});
