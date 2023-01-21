const express = require('express');
const UserModel = require('../models/user.model');
const UserDetails = express.Router();


//Get users profile
UserDetails.get('/:id',async function(req, res) {
    let {id} = req.params;
    try{
        let users = await UserModel.findOne({_id:id});
        res.send(users)
        return;
    }
    catch(err){
        res.send(err.message);
        return;
    } 
});

//Calculate
UserDetails.post('/:id',async function(req, res) {
    let {id} = req.params;
    let {Instalment,InterestRate,Years}=req.body;
    Instalment= Number(Instalment);
    InterestRate=Number(InterestRate)
    Years=Number(Years)
    try{
        let Maturity=0;
        let TotalInvest=Years*Instalment;
       for(let i=1;i<=Years;i++){
        if(i==1){
            Maturity+=Instalment*(1+(0.071*(1)))
        }
        else{
            Maturity=(Maturity+Instalment)*(1+(0.071*(360/360)))
        }
       }
       let InterestGain=Maturity-TotalInvest;
        await UserModel.findByIdAndUpdate({_id:id},{Maturity,InterestGain,TotalInvest});
        let ans = await UserModel.findOne({_id:id})
       res.send(ans)
    }
    catch(err){
        res.send(err.message);
        return;
    } 
});
module.exports = UserDetails;