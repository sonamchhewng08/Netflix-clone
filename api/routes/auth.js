const router=require('express').Router();
const user= require('../models/user');
const CryptoJs=require('crypto-js');
const jwt=require('jsonwebtoken');

router.post('/register',async(req,res,next)=>{
    const newUser=new user({
        username:req.body.username,
        email:req.body.email,
        password:CryptoJs.AES.encrypt(req.body.password,process.env.SECRET_KEY).toString(),
    });
    try {
        const user=await newUser.save();
        res.status(200).json(user); 
    } catch (error) {
        console.log("errr")
        res.status(500).json({err:error});
    }
});

router.post('/login',async(req,res)=>{
    try {
        const User=await  user.findOne({email:req.body.email});
        !User && res.status(401).json({err:"Wrong Password or user not found!"});
        console.log(User.password);
        const  bytes  = CryptoJs.AES.decrypt(User.password, process.env.SECRET_KEY);
        const original = bytes.toString(CryptoJs.enc.Utf8);
        original!==req.body.password &&
            res.status(401).json({err:"Wrong Password or user not found!"});
        const accressToken=jwt.sign({id:user._id,admin:user.admin},process.env.SECRET_KEY,{expiresIn:"2d"});

        const {password,...info}=User._doc;
        res.status(200).json({...info,accressToken});

    } catch (error) {
        res.status(500).json({err:error});
    }
})


module.exports=router;