CREATE DATABASE IF NOT EXISTS nodue_db;
USE nodue_db;

-- 1. Academic Years
CREATE TABLE academic_years (
    id INT AUTO_INCREMENT PRIMARY KEY,
    year_range VARCHAR(20) NOT NULL, -- e.g. "2023-2024"
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Departments
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'tutor', 'teacher', 'student', 'both') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Students Table
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    department_id INT NOT NULL,
    academic_year_id INT NOT NULL,
    register_number VARCHAR(50) NOT NULL UNIQUE,
    current_status ENUM('pending', 'in_progress', 'cleared') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE
);

-- 5. Duties (e.g., Library, Lab, Accounts)
CREATE TABLE duties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Teacher Duty Assignments
CREATE TABLE teacher_duty_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, -- The teacher's user ID
    duty_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (duty_id) REFERENCES duties(id) ON DELETE CASCADE,
    UNIQUE(user_id, duty_id)
);

-- 7. Tutor Assignments
CREATE TABLE tutor_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, -- The tutor's user ID
    department_id INT NOT NULL,
    academic_year_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE,
    UNIQUE(user_id, department_id, academic_year_id)
);

-- 8. Student Clearance Status
CREATE TABLE student_clearance_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    duty_id INT NOT NULL,
    status ENUM('pending', 'cleared', 'due') DEFAULT 'pending',
    remarks TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (duty_id) REFERENCES duties(id) ON DELETE CASCADE,
    UNIQUE(student_id, duty_id)
);

-- 9. Remarks/Logs (Optional but good for history)
CREATE TABLE remarks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    teacher_user_id INT NOT NULL,
    duty_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (duty_id) REFERENCES duties(id) ON DELETE CASCADE
);
