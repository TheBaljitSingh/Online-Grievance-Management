import jwt from 'jsonwebtoken'
import User from '../models/userModel.js';

export const isAuthenticated = async(req, res, next)=>{
  console.log(req.cookies);
    try {
        const {token} = req.cookies;
    
        // If no token is present in cookies
        if (!token) {
          return res.status(401).json({ message: 'Authorization token is missing.' });
        }
    
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret
        console.log(decoded);
        if (!decoded || !decoded.id) {
          return res.status(401).json({ message: 'Invalid or expired token.' });
        }
    
        const user = await User.findById(decoded.id);
        if(!user){
            return res.status(401).json({ message: 'User not found.' });
        }
    
        req.user = user;
        next();
    } catch (error) {
      console.log(error);
        return res.status(401).json({message: "Authentication failed ", error: error.message});
        
    }

}

export const authorizeRoles = (...roles)=>{
  return (req, res, next)=>{
    console.log(req.user.role);

    if(!roles.includes(req.user.role)){
      return res.status(403).json({message: `Role: ${req.user.role} is not allowed to access this resource `})
    }

    next();
  }
}