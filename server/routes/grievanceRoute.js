import express from 'express';

import { isAuthenticated, authorizeRoles} from '../middleware/auth.js';
import { createGrievance, grievanceDetails, grievanceStatus, updateGrievance } from '../controller/grievanceController.js';

const router = express.Router();

router.route("/createGrievance").post(isAuthenticated, createGrievance);
router.route('/:grievanceNumber/status').get(grievanceStatus);
router.route("/:grievanceNumber").put(updateGrievance)
router.route("/:grievanceNumber([0-9]+)").get(grievanceDetails);
/*

Greivance 

user - create grievance, track greivance with greivance 





*/

export default router;