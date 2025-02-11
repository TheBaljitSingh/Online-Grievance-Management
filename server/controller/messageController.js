import Message from "../models/messageModel.js";


export const sendMessage = async (req, res)=>{

    try {
    const {message, receiverId} = req.body;

    if (!message || !receiverId) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }

    const senderId = req.user._id; // getting from token middleware


        const newMessage = await Message.create({message, senderId, receiverId, timeStamp: Date.now()});


        return res.status(200).json({
            success: true,
            message: newMessage,

        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });        
    }


    


}

export const getFilteredMessagesForUser = async (req, res) => {
    try {
        const {senderId} = req.query; // Extract receiver from request query

        if (!senderId) {
            return res.status(400).json({
                success: false,
                message: "senderId is required",
            });
        }

        // Fetch messages where the sender or receiver matches the logged-in user
        const messages = await Message.find({
            $or: [
                { senderId: senderId}, 
                { receiverId: senderId },
            ],
        }).sort({ createdAt: 1 }); // Sort messages in ascending order

        return res.status(200).json({
            success: true,
            messages,
        });

    } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
