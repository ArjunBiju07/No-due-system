# No Due Clearance System
this is original
A full-stack web application for managing student clearance before issuing Transfer Certificates (TC) in colleges.

## Features
- **Role-Based Access Control**: Separate dashboards for Admin, Tutor, Teacher, and Student.
- **Automated Workflow**: Students apply for clearance, Teachers mark dues, Tutors give final approval.
- **Premium UI**: Modern dark-mode interface with glassmorphism and real-time status tracking.
- **Secure**: JWT-based authentication and Bcrypt password hashing.

## Tech Stack
- **Frontend**: React.js, Tailwind-like CSS, Lucide Icons, Axios.
- **Backend**: Node.js, Express.js.
- **Database**: MySQL.

## Setup Instructions

### 1. Database Setup
1. Open your MySQL client (e.g., MySQL Workbench or Command Line).
2. Create a database named `nodue_db`.
3. Import the schema using the `backend/db.sql` file.

### 2. Backend Setup
1. Navigate to the `backend` folder.
2. Create a `.env` file (one has been pre-created for you) and update your DB credentials.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Seed initial data (Admin user, departments, etc.):
   ```bash
   npm run seed
   ```
   *Default Admin Login: admin@college.com / admin123*
5. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Roles & Functionalities
- **Admin**: Create academic years, departments, duties, and assign roles.
- **Tutor**: Verify students in their department and provide final clearance.
- **Teacher**: Approve or mark dues for specific duties (e.g., Library, Lab).
- **Student**: Register, view clearance progress, and apply for TC.
