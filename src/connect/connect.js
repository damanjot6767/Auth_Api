const mongoose = require("mongoose");
require("dotenv").config()

const connect = async()=>{
   return new mongoose.connect(`mongodb+srv://damanjot6767:damanjot6767@cluster0.5qggddx.mongodb.net/calculate?retryWrites=true&w=majority`)
}
module.exports=connect;
