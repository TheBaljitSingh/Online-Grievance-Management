
import User from "../models/userModel.js"
import Grievance from "../models/grievanceModel.js";
import {sendToken} from "../utils/jwtToken.js"
import {sendEmail} from "../utils/sendEmail.js"
import jwt from 'jsonwebtoken';


export const getAllGrievance = async(req, res)=>{

    
    try {
        const grievance = await Grievance.find({user:req.user._id});
        console.log(grievance);
    
        if(!grievance){
            res.status(404).json({success: false, message: "No Grievance Registered"}, )
    
        }
    
        res.status(200).json({success: true, grievance});
    
    } catch (error) {

        res.status(500).json({success: false, message: "error while fetching your grievance"});
        
    }


}



export const verifyToken = async(req, res)=>{

    const {token} =  req.cookies;

    if(!token){
        return res.status(401).json({message: "Token is missing"});
    }

    try {

         const decoded = jwt.verify(token,process.env.JWT_SECRET);

         const user = await User.findById(decoded.id);

         if (!user) {
            return res.status(404).json({ message: "User not found" });
          }
          
        res.json({success: true, user});
        
    } catch (error) {
        console.log(error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token has expired' });
    }

    res.status(401).json({ success: false, message: 'Invalid token' });        
    }



}


export const registerUser = async(req,res)=>{
    const {fullname, email, mobile, password} = req.body;


    const alreadyExist  = await User.findOne({email});

    if(alreadyExist){
        return res.status(400).json({message: "User already Registered"});
    }

    const user = await User.create({
        fullname,email, mobile, password,
    });


    return sendToken(user, 200, res);


}

export const loginUser = async(req, res) =>{
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({message: "Enter email and password"});
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return res.status(400).json({message: "invalid email or password"});
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return res.status(400).json({message: "invalid email or password"});
    }


    // return res.status(400).json({message: "invalid email or password"});

   return sendToken(user, 200, res);


}
export const logoutUser  = async(req, res)=>{

    res.clearCookie("token", {
        httpOnly: true, // Same options as used during creation
        // i have to understand the production
        // secure: process.env.NODE_ENV === "production", // Ensures cookies are only sent over HTTPS in production
        sameSite: "Strict", // Prevents CSRF
    });


    res.status(200).json({ message: "Logged out successfully" });

}

export const getAllGrievanceAdmin = async (req, res)=>{

    try {
        const grievance = await Grievance.find().populate("user", "fullname email");

        if (!grievance) {
            return res.status(404).json({
                success: false,
                message: "No Grievance till now.",
            });
        }

        return res.status(200).json({message: true, grievance});

        
    } catch (error) {

        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
        
    }


}

export const responseToGrievance = async (req, res)=>{
    const {grievanceNumber} = req.params;
    const { responseText} = req.body;
    const adminId = req.user._id;
    try {


        const grievance = await Grievance.findOneAndUpdate({grievanceNumber}, {

            $push:{
                response: {
                    adminId, responseText
                }
            },
            status: "in-progress",
            updateAt:new Date(),
        }).populate("user", "email");

        if (!grievance) {
            return res.status(404).json({
                success: false,
                message: "Grievance not found",
            });
        }
        const userEmail = grievance.user.email;

        await sendEmail({ email: userEmail, subject: "Grievance update", message:`Your grievance no ${grievanceNumber} is now ${grievance.status}.\n An admin has started the investigation.`});

        return res.status(200).json({
            success: true,
            message: "Respons added successfll. and in progress",
            grievance
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
        
    }


}
export const updateGrievanceStatus = async (req, res)=>{
    const { grievanceNumber } = req.params;
    const { status } = req.body;


    try {
        const grievance = await Grievance.findOne({ grievanceNumber }).populate("user", "email");

        if(!grievance){
            return res.status(400).json({
                success: false,
                message: "Grievance not found", 
            })
        }

        const validStatuses = ["pending", "in-progress", "resolved"];
        if(!validStatuses.includes(status)){
            return res.status(400).json({
                    success: false,
                    message: `Invalid status. Valid statuses are: ${validStatuses.join(", ")}`,
              
            })
        }
        const userEmail = grievance.user.email;

        grievance.status = status;
        grievance.updateAt = new Date();

        await grievance.save();

        await sendEmail({ email: userEmail, subject: "Grievance update", message:`Your grievance no ${grievanceNumber} is now ${status} and closed.\n Thanks you`});


        return res.status(200).json({
            success: true,
            message: "Grievance status updated successfully",
            grievance,
        });
        
    } catch (error) {
        
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }

}
