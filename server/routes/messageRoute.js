import express from "express";
import {sendMessage, getFilteredMessagesForUser} from "../controller/messageController.js"
import { isAuthenticated } from "../middleware/auth.js";


const router = express.Router();


router.route("/sendMessage").post(isAuthenticated, sendMessage);
router.route("/getfilteredMessageforUser").get(isAuthenticated, getFilteredMessagesForUser);


// admin:
// admin will fetch the user message which it click on it


export default router;
