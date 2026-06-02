CREATE TABLE semester(
    semester_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    semester_no INT UNIQUE NOT NULL CHECK(semester_no BETWEEN 1 AND 8)
)