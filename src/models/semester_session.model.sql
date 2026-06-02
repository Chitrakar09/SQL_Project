CREATE TABLE semester_session(
    semester_session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    semester_id UUID REFERENCES semester(semester_id) NOT NULL,
    academic_year VARCHAR(10) NOT NULL,
    start_date DATE,
    end_date DATE,
    course_id UUID REFERENCES course(course_id) NOT NULL,
    CHECK (end_date > start_date),
    UNIQUE(course_id,academic_year,semester_id)
);