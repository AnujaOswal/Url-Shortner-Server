import express from "express";
import bcrypt  from 'bcryptjs';
import jwt  from "jsonwebtoken";
import { User } from "../models/userModel.js";

const userRouter = express.Router();


userRouter.get('/',(req,res)=>{
  res.send('connecting backened router')
});



// Registring a user and sending a verification email with a token
userRouter.post('/signup',async (req,res)=>{
  

    const { fname, lname, email, password } = req.body;

    //422-https re-rendor error to show client error
    if ((!fname, !lname, !email, !password)) {
      return res.status(422).json({ error: "Fill all the fields" });
    }
  
    try {
     const isExist  = await User.findOne({ email: email })
    
     if (isExist) {
      return res.status(422).json({ error: "Email-Id already exists!" });
    }

    const user= new User({fname,lname,email,password});

     //Password to be bcrypt before calling the save method -->MiddleWare

     await user.save();

      res.status(201).json({message:"user reg sucessfully"})
    }
    
    catch (err) {
        res.send(err);
      }
    

});


//User Sign In / Login Route
userRouter.post('/signin',async(req,res)=>{
  // console.log(req.body);
  // res.json({message:"signin"})
  try
  {
      const {email,password}=req.body;

      if(!email || !password)
      {
        return res.status(400).json({error:"Plz fill te data"})
      }

     const UserLogin = await User.findOne( {email: email} )

     //console.log(UserLogin);

     if(UserLogin)
     {
      //to verify both password of signin page and databse password compare and if it is matched
      const isMatch = await bcrypt.compare(password,UserLogin.password);

      const token = await UserLogin.generateAuthToken();
      console.log(`jwt token : ${token}`)

      //to store token in cookie to identify the user and automatically get login
      res.cookie("jwttoken",token,{
        expires:new Date(Date.now()+1800000),
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });


         if(!isMatch)
         {
           res.status(400).json({error :"Invalid Credientails"});
         }else{
           res.json({message:"User sign in successfully!--->"});
         }
      
     }else{
      res.status(400).json({error :"Invalid Credientails"});
     }

     

  }catch(err){
    console.log(err)
  }
});

export { userRouter };