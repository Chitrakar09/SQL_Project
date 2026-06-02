import { Router } from "express";
import {
  createSemester,
  getSemesterById,
  getAllSemester,
  updateSemester,
  deleteSemester,
  createSemesterSession,
  getSemesterSessionById,
  updateSemesterSession,
  deleteSemesterSession
} from "../controllers/semester.controller.js";

const router = Router();

router.route("/").post(createSemester).get(getAllSemester);;
router.route("/:id").get(getSemesterById).patch(updateSemester).delete(deleteSemester);
router.route("/semesterSession/").post(createSemesterSession)
router.route("/semesterSession/:id").get(getSemesterSessionById).patch(updateSemesterSession).delete(deleteSemesterSession)

export default router;