const router=require('express').Router();
const movies=require('../models/movie');
const authenticated=require('../verifyUser');

//getall
router.get('/getAll/:id',authenticated,async (req,res)=>{
    try {
        const getAllmovie= await movies.find();
        res.status(200).json(getAllmovie);
    } catch (error) {
        res.status(403).json(error)
    }
   
})
//get random
router.get('/random',authenticated,async (req,res)=>{
    const type=req.query.type;
    let movie;
    try {
        if(type==="series"){
            movie= await movies.aggregate([
                {$match:{isSeries:true}},
                {$sample:{size:1}}
            ])
        }else{
            movie= await movies.aggregate([
                {$match:{isSeries:false}},
                {$sample:{size:1}}
            ])
        }
        res.status(200).json(movie);
    } catch (error) {
        res.status(403).json(error)
    }
   
})
//get
router.get('/get/:id',authenticated,async(req,res)=>{
    try {
        const getmovie= await movies.findById(req.params.id);
        res.status(200).json(getmovie);
    } catch (error) {
        res.status(403).json(error)
    }
   
})
//create 
router.post('/add',authenticated,async (req,res,next)=>{
    if(req.user.admin){
        const newmovie= new movies(req.body);
        try {
            const sav= await newmovie.save();
            res.status(201).json("movie saved!")
        } catch (error) {
            res.status(403).json(error)
        }
    }else{
        res.status(403).json("you are not allowed!")
    }
})

//update 
router.patch('/update/:id',authenticated,async(req,res)=>{
    if(req.user.admin){
        try {
            const updatemovie= await movies.findByIdAndUpdate(req.params.id,{
                $set:req.body
            },{new:true});
            res.status(200).json(updatemovie);
        } catch (error) {
            res.status(403).json(error)
        }
    }else{
        res.status(403).json("you are not allowed!")
    }
})
//delete
router.delete('/delete/:id',authenticated,async(req,res)=>{
    if(req.user.admin){
        try {
            await movies.findByIdAndDelete(req.params.id);
            res.status(200).json("movie deleted!");
        } catch (error) {
            res.status(403).json(error)
        }
    }else{
        res.status(403).json("you are not allowed!")
    }
})

module.exports=router;