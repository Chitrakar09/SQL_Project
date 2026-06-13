import { Router } from "express";
import {
  registerEnrollment,
  getEnrollmentById,
  updateEnrollment,
  deactivateEnrollment,
  getStudentsOfDepartment,
  countStudentsPerDepartment,
  getStudentsByCourses,
  getStudentsOfCourse,
  getStudentsWithoutEnrollment,
} from "../controllers/enrollment.controller.js";

const router = Router();

router.route("/register").post(registerEnrollment);
router.route("/:id").get(getEnrollmentById).patch(updateEnrollment).delete(deactivateEnrollment);
router.route("/department/:id/students").get(getStudentsOfDepartment);
router.route("/department/student-count").get(countStudentsPerDepartment);
router.route("/courses/students").get(getStudentsByCourses);
router.route("/course/:id/students").get(getStudentsOfCourse);
router.route("/students/without-enrollment").get(getStudentsWithoutEnrollment);

export default router;