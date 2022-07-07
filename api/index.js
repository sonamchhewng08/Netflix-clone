const express = require('express');
const app = express();
const dotenv=require('dotenv');
const port=8000|| process.env.PORT;
dotenv.config();

const authRouter=require('./routes/auth');
const userRouter=require('./routes/user');
const movieRouter =require('./routes/movies');
const listRouter =require('./routes/list');

app.use(express.json());
app.use('/api/auth',authRouter);
app.use('/user',userRouter);
app.use('/movies',movieRouter);
app.use('/lists',listRouter);

const mongoose= require('mongoose');
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log("database connected!"))
.catch((err)=>console.log(err));

app.listen(port,()=>{
    console.log('server is running');
})