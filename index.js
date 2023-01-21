require("dotenv").config()
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const connect = require('./src/connect/connect.js');
const Auth = require("./src/routes/Auth.js");
const cors = require("cors");
const UserDetails = require("./src/routes/users.js");
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use("/",Auth);
app.use("/profile",UserDetails);

app.listen(process.env.PORT,async()=>{
  await connect().then((res)=>console.log("database connected")).catch((res)=>console.log("not connected"))
  console.log("working")
})