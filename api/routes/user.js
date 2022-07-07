const router=require('express').Router();
const user = require('../models/user');
const CryptoJS= require('crypto-js');
const authenticated=require('../verifyUser');

//get all user
router.get('/getall/',authenticated,async (req,res)=>{
    const query=req.query.new;
    if(req.user.admin){
        try {
            const users= query? await user.find().sort({_id:-1}).limit(10):await user.find();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json(error);
        }
    }else{
        res.status(403).json("you are not authorized!");
    }
    
})

//get a user
router.get('/get/:id',async (req,res)=>{
    try {
        const user=await user.findById(req.params.id);
        const {password,...info}=user._doc;
        res.status(200).json(info);

    } catch (error) {
        res.status(500).json(error);
    }
})

//update user
router.patch('/update/:id',authenticated,async (req,res)=>{
    if(req.user._id===req.params.id || req.user.admin){
        if(req.user.password){
            req.user.password=CryptoJS.AES.encrypt(req.body.password,
            process.env.SERCET_KEY
                ).toString();
        }
        try {
            const updateUser=await user.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});
            res.status(200).json(updateUser);

        } catch (error) {
            res.status(500).json(error);
        }
    }else{
        res.status(403).json("invalid user");
    }
})

//delete user
router.delete('/delete/:id',authenticated,async (req,res)=>{
    if(req.user._id===req.params.id || req.user.admin){
        try {
            const updateUser=await user.findByIdAndDelete();
            res.status(200).json("user deleted!");

        } catch (error) {
            res.status(500).json(error);
        }
    }else{
        res.status(403).json("invalid user");
    }
})
module.exports=router;