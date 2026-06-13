import { Router } from "express";
import {
  registerCourse,
  getCourseById,
  getAllCourse,
  updateCourse,
  deleteCourse,
  getAllCourseOfDepartment,
  getCoursesBySemester,
  getCourseFullDetails,
  getCoursesTaughtByInstructor,
  getMostPopularCourse,
  getCoursesWithNoInstructor,
} from "../controllers/course.controller.js";

const router = Router();

router.route("/register").post(registerCourse);
router.route("/:id").get(getCourseById).patch(updateCourse).delete(deleteCourse);
router.route("/details/:id").get(getCourseFullDetails);
router.route("/").get(getAllCourse);
router.route("/department/:id").get(getAllCourseOfDepartment);
router.route("/semester").get(getCoursesBySemester);
router.route("/instructor/:id").get(getCoursesTaughtByInstructor);
router.route("/analytics/most-popular").get(getMostPopularCourse);
router.route("/analytics/no-instructor").get(getCoursesWithNoInstructor);

export default router;