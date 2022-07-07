const mongoose= require('mongoose');

const list=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true,
        unique:true
    },
    gernre:String,
    content:{
        type:Array
    }
},{timestamps:true} );

module.exports=mongoose.model('list',list);