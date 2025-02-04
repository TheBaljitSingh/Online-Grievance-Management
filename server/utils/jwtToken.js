import jwt from 'jsonwebtoken'

export const sendToken = (user, statusCode, res)=>{


    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })

    const option = {
        expires:new Date(
        Date.now()+process.env.COOKIE_EXPIRE*24*60*60*1000
        ),
        httpOnly: true,
        secure: true,
        sameSite: "None"
    };

    res.status(statusCode).cookie("token", token, option).json({
        success: true,
        user, token,
    })
}
