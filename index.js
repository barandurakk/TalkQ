const express = require("express");
const mongoose = require("mongoose");
const keys = require("./util/keys");
const bodyParser = require("body-parser");

const cors = require("cors");

//models

/* -- */

//database connect
mongoose.connect(keys.mongoURI);

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

console.log("selam server!");

require("./routes/auth")(app);

//bu logic temel olarak productionda çalışan express serverimizin cevap olarak client serverimizi (react app) tanıması ve cevap gönderebilmesi için.
if (process.env.NODE_ENV === "production") {
  const path = require("path");
  //Express main.js ve main.css gibi dosyalara ulaşıp cevap verebilsin diye.
  app.use(express.static(path.join(__dirname, "/client/build")));

  //Express gelen route'u tanımazsa index.html sayfasını cevap olarak göndersin diye.

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
