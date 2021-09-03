import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { router } from "./routes/url.js";
import { userRouter } from "./routes/userRouter.js";
import cors from "cors";

const app = express();

dotenv.config({path : "./config.env"});

const DB = process.env.DATABASE;

mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
}).then(()=>{
    console.log('MONGODB-Database connection successfully!!')
}).catch((err)=>console.log('no connection'))


var corsOptions = { origin: true, credentials: true };

app.use(cors(corsOptions));
app.use(express.json());
app.use("/", router);
app.use("/",userRouter);

const PORT = process.env.PORT ;


app.get('/', (request, respone) => {
    respone.send('<h1>Home Page Of URL-SHORTNER-PAGE</h1>');
})


app.listen(PORT,()=>console.log(`URL-SHORTNER-BACKEND-Node-Server-file is running on  ${PORT}`));
