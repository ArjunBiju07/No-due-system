import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import CreateDuty from './pages/admin/CreateDuty';
import AssignDuties from './pages/admin/AssignDuties';
import ManageUsers from './pages/admin/ManageUsers';
import AdminOverview from './pages/admin/AdminOverview';
import CreateUser from './pages/admin/CreateUser';
import CreateDept from './pages/admin/CreateDept';
import CreateAcademicYear from './pages/admin/CreateAcademicYear';
import CourseDropApprovals from './pages/tutor/YearDropApprovals';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

// Teacher Pages
import TeacherHome from './pages/teacher/TeacherHome';
import SetDues from './pages/teacher/SetDues';
import ShowDues from './pages/teacher/ShowDues';

// Tutor Pages
import TutorOverview from './pages/tutor/TutorOverview';
import RequestVerification from './pages/tutor/RequestVerification';
import ApprovedStudents from './pages/tutor/ApprovedStudents';
import Conduct from './pages/tutor/Conduct';

// Student Pages
import StudentHome from './pages/student/StudentHome';
import ClearanceStatus from './pages/student/ClearanceStatus';
import CourseDropRequest from './pages/student/YearDropRequest';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="fixed inset-0 bg-[#faf8ff] flex flex-col items-center justify-center gap-6 z-[9999]">
      <div className="relative">
        <div className="h-16 w-16 border-[6px] border-blue-900/10 border-t-blue-900 rounded-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-2 w-2 bg-blue-900 rounded-full" />
        </div>
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 ml-2">Syncing Session Protocol</p>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role && !(user.role === 'both' && (role === 'teacher' || role === 'tutor'))) return <Navigate to="/" />;

  return children;
};

const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  switch (user.role) {
    case 'admin': return <Navigate to="/admin" />;
    case 'tutor': return <Navigate to="/tutor" />;
    case 'both':
    case 'teacher': return <Navigate to="/teacher" />;
    case 'student': return <Navigate to="/student" />;
    default: return <Navigate to="/login" />;
  }
};

const AppContent = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#020617]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={`flex-1 flex flex-col min-w-0 overflow-x-hidden min-h-screen ${user ? 'lg:pl-72' : ''}`}>
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/admin" element={
              <ProtectedRoute role="admin">
                <AdminOverview />
              </ProtectedRoute>
            } />

            <Route path="/admin/create-user" element={
              <ProtectedRoute role="admin">
                <CreateUser />
              </ProtectedRoute>
            } />

            <Route path="/admin/create-dept" element={
              <ProtectedRoute role="admin">
                <CreateDept />
              </ProtectedRoute>
            } />

            <Route path="/admin/create-year" element={
              <ProtectedRoute role="admin">
                <CreateAcademicYear />
              </ProtectedRoute>
            } />

            <Route path="/admin/create-duty" element={
              <ProtectedRoute role="admin">
                <CreateDuty />
              </ProtectedRoute>
            } />

            <Route path="/admin/assign-duties" element={
              <ProtectedRoute role="admin">
                <AssignDuties />
              </ProtectedRoute>
            } />

            <Route path="/admin/manage-users" element={
              <ProtectedRoute role="admin">
                <ManageUsers />
              </ProtectedRoute>
            } />

            <Route path="/tutor/year-drops" element={
              <ProtectedRoute role="tutor">
                <CourseDropApprovals />
              </ProtectedRoute>
            } />

            <Route path="/tutor" element={
              <ProtectedRoute role="tutor">
                <TutorOverview />
              </ProtectedRoute>
            } />

            <Route path="/tutor/verification" element={
              <ProtectedRoute role="tutor">
                <RequestVerification />
              </ProtectedRoute>
            } />

            <Route path="/tutor/conduct/:student_id" element={
              <ProtectedRoute role="tutor">
                <Conduct />
              </ProtectedRoute>
            } />

            <Route path="/tutor/approved" element={
              <ProtectedRoute role="tutor">
                <ApprovedStudents />
              </ProtectedRoute>
            } />

            <Route path="/teacher" element={
              <ProtectedRoute role="teacher">
                <TeacherHome />
              </ProtectedRoute>
            } />

            <Route path="/teacher/set-dues" element={
              <ProtectedRoute role="teacher">
                <SetDues />
              </ProtectedRoute>
            } />

            <Route path="/teacher/show-dues" element={
              <ProtectedRoute role="teacher">
                <ShowDues />
              </ProtectedRoute>
            } />

            <Route path="/student" element={
              <ProtectedRoute role="student">
                <StudentHome />
              </ProtectedRoute>
            } />

            <Route path="/student/status" element={
              <ProtectedRoute role="student">
                <ClearanceStatus />
              </ProtectedRoute>
            } />

            <Route path="/student/year-drop" element={
              <ProtectedRoute role="student">
                <CourseDropRequest />
              </ProtectedRoute>
            } />



            <Route path="/" element={<HomeRedirect />} />
          </Routes>
          <Footer />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
