const express = require('express');
const UserModel = require('../models/user.model');
const RandomWord = express.Router();


//create user
RandomWord.post('/level',async function(req, res) {
    const{name,level}=req.body;
    try{
        let user= new UserModel({name:name})
        let users = await user.save();
        res.send({name:users.name,id:users._id,level:level})
        return;
    }
    catch(err){
        res.send(err.message)
    } 
});

RandomWord.get('/random',function(req, res) {
    const{level}=req.body;
    try{
        const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const n = characters.length;
        let word=""
        if(level==="low"){
          for(let i=0;i<5;i++){
            word+=characters[Math.floor(Math.random()*n)]
          }
        }
        else if(level==="medium"){
            for(let i=0;i<7;i++){
                word+=characters[Math.floor(Math.random()*n)]
              }
        }
        else if(level==="high"){
            for(let i=0;i<10;i++){
                word+=characters[Math.floor(Math.random()*n)]
              }
        }
        res.send({word:word})
        return;
    }
    catch(err){
        res.send(err.message)
    } 
});

RandomWord.post('/score/:id',async(req,res)=>{
    const{id}=req.params;
    const{score,level}=req.body;
    try {
        let user = await UserModel.findOne({_id:id});
        let update = user.score.total+ Number(score);
        let scores = user.score.scores;
        scores.push({level:level,score})
        let newData = {total:update,scores:scores}
        await UserModel.findByIdAndUpdate({_id:id},{score:newData});
        let newUser = await UserModel.findOne({_id:id});
        return res.send(newUser)
    } catch (error) {
        
    }
})


module.exports = RandomWord;