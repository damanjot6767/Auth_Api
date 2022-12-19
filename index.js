import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./Controllers/auth.js";
import router from "./routes/auth.js";
import UserRouter from "./routes/users1.js";
import { verifytoken } from "./middleware/verify.js";
import { createPost } from "./Controllers/Post.js";
import postRouter from "./routes/posts.js";
import User from "./Models/User.js";
import jwt from "jsonwebtoken";
import nodemailer1 from "nodemailer";
import bcrypt from "bcrypt";

const transporter1 = nodemailer1.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'quinton.ritchie@ethereal.email',
      pass: 'wnJFCdPhumqx3wTy3N'
    }
});
let blacklist=[]

//Middleware
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
app.use(cors());
app.use("/assets",express.static(path.join(__dirname,'public/assets')));

//file storage;
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"public/assets");
    },
    filename:function(res,file,cb){
        cb(null,file.originalname)
    }
})
const upload = multer({storage});

//All routes
app.post("/auth/register",register)
app.post("/posts",verifytoken,upload.single("picture"),createPost)

app.use("/auth",router);
app.use("/users",UserRouter);
app.use("/posts",postRouter);

// for generate otp
app.get("/reset-password",async(req,res)=>{
    const{email} = req.body;
    try{
        const user = await User.findOne({email:email});
        if(user){
            let otp = Math.floor(Math.random()*1000000+1)
            const token = jwt.sign({id:user._id},`${otp}`,{expiresIn:"2 mins"});
            transporter1.sendMail({
                from: 'damnanjot@gmail.com', // sender address
                to: email, // list of receivers
                subject: "Forget Password ✔", // Subject line
                html: `<b>Hello ${user.firstName} ${user.lastName},Your OTP For Forget Password is ${otp} and your token is ${token}</b>`, // html body
              });
            return res.status(201).send(`Enter your otp and token send on your mail`)
        }
        return res.status(403).send("Invalid Details")
    }
    catch(err){
        res.status(401).send(err.message)
    }
})
// for verify otp
app.post("/reset-password/reset",async(req,res)=>{
   const{newpassword,otp,token}=req.body;
   if(!otp){
    return res.status(403).send("Unauthorized")
   }
   if(blacklist.includes(token)){
    return res.status(401).send("token expired");
}
   try{
      const verifyOtp = jwt.verify(token,`${otp}`);
      if(verifyOtp){
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(newpassword, salt);
        await User.findByIdAndUpdate({_id:verifyOtp.id},{password:passwordHash});
        return res.send("Password update successfully")
      }
      return res.status(403).send("Invalid otp")
   }
   catch(err){
    if(err.message==="jwt expired"){
        blacklist.push(token);
        return res.status(401).send("Otp Expired Generate New Otp")
    }
        return res.status(401).send(err.message)
   }
})

//for logout password
app.get("/logout/:id",async(req,res)=>{
   const{id}=req.params;
   const{token}=req.body;
  try{
    const user = await User.findById(id);
    if(user){
     await User.findByIdAndDelete(id);
     blacklist.push(token);
     return res.status(201).send("Logout Successfully")
    }
  }
  catch(err){
    return res.status(404).send(err.message)
  }
})
// Port and Url setup
const PORT=process.env.PORT;
const connect = async ()=>{
    return new mongoose.connect("mongodb://localhost:27017/BlogApp")
}

app.listen(PORT,async()=>{
 await connect().then(()=>console.log(`Server Connected ${PORT}`)).catch(()=>console.log("Not Connected"));
 console.log("working")
})