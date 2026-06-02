import { Router } from "express";
import {
  createDepartment,
  getDepartmentById,
  getAllDepartments,
  updateDepartment,
  deleteDepartment,
} from "../controllers/department.controller.js";

const router = Router();

router.route("/register").post(createDepartment);
router.route("/:id").get(getDepartmentById).patch(updateDepartment).delete(deleteDepartment);
router.route("/").get(getAllDepartments);

export default router;