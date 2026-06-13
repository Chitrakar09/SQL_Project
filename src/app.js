import express from "express";
import cors from "cors";

const app = express();

// middleware for CORS conflict resolve
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

// middleware to parse JSON request bodies
app.use(
  express.json({
    limit: "16kb",
  }),
);

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// routes
import studentRouter from "./routes/student.routes.js";
import departmentRouter from "./routes/department.routes.js";
import courseRouter from "./routes/course.routes.js";
import instructorRouter from "./routes/instructor.routes.js";
import semesterRouter from "./routes/semester.routes.js";
import enrollmentRouter from "./routes/enrollment.routes.js";

// routes for students
app.use("/api/v1/student", studentRouter);
// routes for departments
app.use("/api/v1/department", departmentRouter);
// routes for courses
app.use("/api/v1/course", courseRouter);
// routes for enrollments
app.use("/api/v1/enrollments", enrollmentRouter);
// routes for instructors
app.use("/api/v1/instructor", instructorRouter);
// routes for semester
app.use("/api/v1/semester", semesterRouter);

export { app };
