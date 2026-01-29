import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Contacts from './pages/Contacts';
import Deals from './pages/Deals';

import Activities from './pages/Activities';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Teams from './pages/Teams';
import Careers from './pages/Careers';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

/**
 * Main Application Component.
 * Sets up routing, authentication, and theme providers.
 */
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="accounts" element={<Accounts />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="deals" element={<Deals />} />
              <Route path="active_deals" element={<Reports />} />
              <Route path="activities" element={<Activities />} />
              <Route path="settings" element={<Settings />} />

              <Route path="customers" element={<Accounts />} />
              <Route path="reports" element={<Reports />} />
              <Route path="teams" element={<Teams />} />
              <Route path="careers" element={<Careers />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
