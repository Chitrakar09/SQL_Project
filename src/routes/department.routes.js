import { Router } from "express";
import {
  registerDepartment,
  getDepartmentById,
  getAllDepartments,
  updateDepartments,
  deleteDepartment,
  getDepartmentStudentCount,
} from "../controllers/department.controller.js";

const router = Router();

router.route("/register").post(registerDepartment);
router.route("/:id").get(getDepartmentById).patch(updateDepartments).delete(deleteDepartment);
router.route("/").get(getAllDepartments);
router.route("/student-count").get(getDepartmentStudentCount);

export default router;