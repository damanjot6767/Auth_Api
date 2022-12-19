import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import nodemailer from "nodemailer";
import { token } from "morgan";

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'quinton.ritchie@ethereal.email',
      pass: 'wnJFCdPhumqx3wTy3N'
    }
});

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    // transporter.sendMail({
    //   from: 'damnanjot@gmail.com', // sender address
    //   to: email, // list of receivers
    //   subject: "Registration ✔", // Subject line
    //   html: `<b>Hello ${firstName} ${lastName} you registered successfully</b>`, // html body
    // });
    const token = jwt.sign({...newUser},"SECRET123456");
    return res.status(201).json({user:savedUser,token:token});
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//Login
export const login = async(req,res)=>{
    try{
      const{email,password}=req.body;
      const user = await User.findOne({email:email});
      if(!user){
        return res.status(400).json({ msg: "User does not exist. " });
      }
      const isMatch = await bcrypt.compare(password,user.password);
      if(!isMatch) {return res.status(400).json({ msg: "Invalid credentials. " });}

      const token = jwt.sign({id:user._id},"SECRET123456");
      delete user.password;
      res.status(200).send({token:token,user:user});
    }
    catch(err){
        res.send(401).send({error:err.message})
    }
}