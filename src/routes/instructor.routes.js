import { Router } from "express";
import {
  registerInstructor,
  getInstructorById,
  getAllInstructors,
  updateInstructor,
  deactivateInstructor,
  assignInstructorCourse,
  getInstructorCourseById,
  updateInstructorCourse,
  getInstructorsByDepartment,
} from "../controllers/instructor.controller.js";

const router = Router();

router.route("/register").post(registerInstructor);
router.route("/:id").get(getInstructorById).patch(updateInstructor).delete(deactivateInstructor);
router.route("/").get(getAllInstructors);
router.route("/department").get(getInstructorsByDepartment);
router.route("/assignCourse/:instructorId/:courseId").post(assignInstructorCourse);
router.route("/instructorCourse/:id").get(getInstructorCourseById).patch(updateInstructorCourse);

export default router;