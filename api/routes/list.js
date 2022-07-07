const router=require('express').Router();
const list=require('../models/list');
const authenticated=require('../verifyUser');

 //create
router.post('/add',authenticated,async (req,res,next)=>{
    if(req.user.admin){
        const newList= new list(req.body);
        try {
            const sav= await newList.save();
            res.status(201).json("list saved!")
        } catch (error) {
            res.status(403).json(error)
        }
    }else{
        res.status(403).json("you are not allowed!")
    }
})
//get
router.get('/get',authenticated,async (req,res,next)=>{
    const typeQuery=req.query.type;
    const genreQuery=req.query.genre;
    let List=[];
    try {
        if(typeQuery){
            if(genreQuery){
                List=await list.aggregate([
                    {$smaple:{size:10}},
                    {$match:{type:typeQuery,genre:genreQuery}}
                ]);
            }else{
                List=await list.aggregate([
                    {$smaple:{size:10}},
                    {$match:{type:typeQuery}}
                ]);
            }
        }else{
            List=await list.aggregate([{$sample:{size:10}}]); 
        }
        res.status(200).json(List);
    } catch (error) {
        res.status(500).json(error);
    }
})

//delete
router.delete('/delete/:id',authenticated,async (req,res,next)=>{
    if(req.user.admin){
        try {
            list.findByIdAndDelete(req.params.id);
            res.status(200).json("list deleted!");
        } catch (error) {
            res.status(403).json(error)
        }
    }else{
        res.status(403).json("you are not allowed!")
    }
})

module.exports=router;