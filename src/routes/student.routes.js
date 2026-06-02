import { Router } from "express";
import {
  registerStudent,
  getStudentById,
  getAllStudents,
  updateStudent,
  deactivateStudent,
} from "../controllers/student.controller.js";

const router = Router();

router.route("/register").post(registerStudent);
router.route("/:id").get(getStudentById).patch(updateStudent).delete(deactivateStudent);
router.route("/").get(getAllStudents)

export default router;