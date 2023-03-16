const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 8000;
const ejs = require("ejs");

const expressEjsLayouts = require("express-ejs-layouts");

app.get("/", (req, res) => {
  res.render("home");
});

//set template engine

app.use(expressEjsLayouts);
app.set("views", path.join(__dirname, "/resource/views"));
app.set("view engine", "ejs");
app.listen(8000, () => {
  console.log("server started on port ", PORT);
});
