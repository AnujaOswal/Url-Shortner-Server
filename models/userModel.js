import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema =new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  tokens:[
    {
      token:{
        type: String, 
        required: true
      }
    }
  ]
})



//we are performing Hashing the password

userSchema.pre('save', async function(next){
  if(this.isModified('password'))
  {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

//we are generating token
userSchema.methods.generateAuthToken = async function()
{
  try
  {
    let token = jwt.sign({_id:this._id},process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({token:token});
    await this.save();
    return token;
  }catch(err){
    console.log(err);
  }
}

export const User = mongoose.model("USER",userSchema);

