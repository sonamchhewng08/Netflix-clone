const mongoose= require('mongoose');

const movies=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    desc:{
        type:String,
        required:true,
        unique:true
    },
    img:{
        type:String,
        required:true,
    },
    titleImage:{
        type:String,
        default:"",
    },
    tumbnale:{
        type:Boolean,
        default:false
    },
    trailer:{
        type:String
    },
    video:String,
    year:String,
    limit:Number,
    genre:String,
    isSeries:{
        type:Boolean,
        default:false
    }
},{timestamps:true} );

module.exports=mongoose.model('movies',movies);