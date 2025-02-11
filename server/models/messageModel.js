import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
    senderId: {
      type:  mongoose.Schema.Types.ObjectId,
      require: true
    },
    receiverId: {
      type:  mongoose.Schema.Types.ObjectId,
      require: true
    },
    message:{
      type: String,
      require: true
    },
    status: { type: String, default: "sent" },
    timeStamp: Date,
  });

const Message = mongoose.model("Message", messageSchema);

export default Message;
