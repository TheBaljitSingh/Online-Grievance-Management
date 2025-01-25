import express from 'express';

import {loginUser, logoutUser, registerUser, getAllGrievanceAdmin, getAllGrievance, responseToGrievance, updateGrievanceStatus, verifyToken, googleAuth} from "../controller/userController.js"
import { isAuthenticated, authorizeRoles} from '../middleware/auth.js';

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/verifyToken").get(verifyToken);
router.route("/getAllGrievance").get(isAuthenticated, getAllGrievance)
// google login
router.route('/google-login').post(googleAuth);

//  admin
router.route("/getAllGrievanceAdmin").get(isAuthenticated, authorizeRoles("admin"), getAllGrievanceAdmin);
router.route("/grievance/:grievanceNumber/respond").put(isAuthenticated, authorizeRoles("admin"), responseToGrievance);
router.route("/grievance/:grievanceNumber/updateStatus").put(isAuthenticated, authorizeRoles("admin"), updateGrievanceStatus);





export default router;