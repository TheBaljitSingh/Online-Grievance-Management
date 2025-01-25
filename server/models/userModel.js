import mongoose from "mongoose"

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypt from "crypto"



const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: 'Please enter your name',
    },
    email: {
        type: String,
        required: 'Please enter your email id',
        unique: true, // Ensures email is unique
     
    },
    mobile: {
        type: String, // Use String to handle phone numbers with leading zeros
        // required: 'Please enter your mobile',
    },
    password: {
        type: String,
        // required: 'Please enter your password',
    },
    role: {
        type: String,
        default: "user"
    }
}, { timestamps: true }); // Automatically adds `createdAt` and `updatedAt` fields


userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
        
    });
};

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;

