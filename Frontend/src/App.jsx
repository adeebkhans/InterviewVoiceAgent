import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Login from './pages/Login';
import Jobs from './pages/Jobs';
import Candidates from './pages/Candidates';
import Appointments from './pages/Appointments';
import VADashboard from './pages/VADashboard';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/admin/jobs" replace />} />
            <Route path="jobs/*" element={<Jobs />} />
            <Route path="candidates/*" element={<Candidates />} />
            <Route path="appointments/*" element={<Appointments />} />
            <Route path="voice" element={<VADashboard />} />
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
