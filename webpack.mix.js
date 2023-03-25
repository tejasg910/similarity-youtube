let mix = require("laravel-mix");

mix
  .js("resource/js/app.js", "public/js/app.js")
  .sass("resource/scss/app.scss", "public/css/app.css");
