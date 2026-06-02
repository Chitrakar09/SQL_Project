CREATE TABLE enrollment(
    enrollment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES student(student_id) NOT NULL,
    course_id UUID REFERENCES course(course_id) NOT NULL,
    enrollment_year DATE NOT NULL,
    current_status VARCHAR(20) CHECK(lower(current_status) IN ('active','completed','dropped','failed','withdrawn')),
    semester_session_id UUID REFERENCES semester_session(semester_session_id) NOT NULL,
    UNIQUE(student_id,course_id)
);