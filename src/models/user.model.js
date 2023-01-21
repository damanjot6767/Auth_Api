const {Schema,model} = require("mongoose");

const UserSchema = new Schema({
   name:{type:String,required:true},
   email:{type:String,required:true,unique:true},
   password:{type:String,required:true,unique:true},
   Maturity:{type:Number,default:0},
   TotalInvest:{type:Number,default:0},
   InterestGain:{type:Number,default:0}
})

const UserModel = new model("auth",UserSchema);
module.exports = UserModel;
