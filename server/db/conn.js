import mongoose from "mongoose";

export const connectDatabase = async()=>{

    await mongoose.connect(process.env.DB_URI)
    .then ((data)=>{
        console.log(`Database connectin successfull`);
    })
    .catch((e)=>{
        console.log(`Database Connection Error ${e}`)
    })
}



