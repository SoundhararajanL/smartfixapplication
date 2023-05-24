

const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv/config");

//Body-parser
app.use(express.json());

//middleware
app.use(morgan("dev"));

//Router
const Personrouter = require("./PersonsRoute");
app.use("/persons", Personrouter);

//localhost
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});

mongoose.set("strictQuery", false);

//Db server creation
mongoose.connect(process.env.MYDB_CONNECTION, (err) => {
  if (err) {
    console.log("DB not connected", err);
  } else {
    console.log("DB connected successfully");
  }
});
