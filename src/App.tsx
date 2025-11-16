import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import DashboardLayout from './components/layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Departments from './pages/Departments';
import Students from './pages/Students';
import MarkAttendance from './pages/MarkAttendance';
import BlockchainExplorer from './pages/BlockchainExplorer';

function App() {
  return (
    <AppProvider>
      <Router>
        <AnimatePresence mode="wait">
          <DashboardLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/students" element={<Students />} />
              <Route path="/attendance" element={<MarkAttendance />} />
              <Route path="/explorer" element={<BlockchainExplorer />} />
            </Routes>
          </DashboardLayout>
        </AnimatePresence>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'rgba(10, 10, 15, 0.95)',
              color: '#fff',
              border: '1px solid rgba(0, 245, 255, 0.3)',
              backdropFilter: 'blur(10px)',
            },
            success: {
              iconTheme: {
                primary: '#00ff88',
                secondary: '#0a0a0f',
              },
            },
            error: {
              iconTheme: {
                primary: '#ff0055',
                secondary: '#0a0a0f',
              },
            },
          }}
        />
      </Router>
    </AppProvider>
  );
}

export default App;
