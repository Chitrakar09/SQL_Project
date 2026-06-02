import { Router } from "express";
import {
  createCourse,
  getCourseById,
  getAllCourses,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller.js";

const router = Router();

router.route("/register").post(createCourse);
router.route("/:id").get(getCourseById).patch(updateCourse).delete(deleteCourse);
router.route("/").get(getAllCourses);

export default router;