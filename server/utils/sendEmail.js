import nodeMailer from "nodemailer"


export const sendEmail = async(options)=>{

    const transport = nodeMailer.createTransport({
        // host and port add karo agar gamil me dikkat aa rahi hai to
        service:process.env.SMPT_SERVICE,
        auth:{
            user:process.env.SMPT_MAIL,
            pass:process.env.SMPT_PASSWORD,
        }
    })

    const mailOptions = {
        from:process.env.SMPT_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message
    }

    try {
        const info = await transport.sendMail(mailOptions);
        console.log("email send: ", info);
        return info;
        
    } catch (error) {
        console.error("Error sending email:", err);
        throw err;
    }
  


}

