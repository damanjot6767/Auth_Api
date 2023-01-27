const {Schema,model} = require("mongoose");

const UserSchema = new Schema({
   name:{type:String,required:true},
   score:{total:{type:Number,default:0},scores:[]}
})

const UserModel = new model("score",UserSchema);
module.exports = UserModel;
