import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
    senderId: {
      type:  mongoose.Schema.Types.ObjectId
    },
    // recipientId: {
    //   type:  mongoose.Schema.Types.ObjectId
    // },
    messageContent: String,
    timeStamp: Date,
    status: { type: String, default: "sent" }, // "sent", "delivered", "read"
  });

const Message = mongoose.model("Message", messageSchema);

export default Message;
