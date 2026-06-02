import { Router } from "express";
import {
  createEnrollment,
  getEnrollmentById,
  getAllEnrollments,
  updateEnrollment,
  deactivateEnrollment,
} from "../controllers/enrollment.controller.js";

const router = Router();

router.route("/register").post(createEnrollment);
router.route("/:id").get(getEnrollmentById).patch(updateEnrollment).delete(deactivateEnrollment);

export default router;