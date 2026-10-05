import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import useAndroidBackButton from './hooks/useAndroidBackButton';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AssistantWidget from './components/AssistantWidget';
import PrivateRoute from './components/PrivateRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import StorageBrowse from './pages/StorageBrowse';
import StorageDetails from './pages/StorageDetails';
import BookingForm from './pages/BookingForm';
import MyBookings from './pages/MyBookings';
import BookingDetails from './pages/BookingDetails';
import AdminDashboard from './pages/AdminDashboard';
import BecomeLandlord from './pages/BecomeLandlord';
import ListSpace from './pages/ListSpace';
import MyListings from './pages/MyListings';
import Messages from './pages/Messages';
import ChatDavid from './pages/ChatDavid';
import HelpCenter from './pages/HelpCenter';
import About from './pages/About';
import ComingSoon from './pages/ComingSoon';

const NO_FOOTER = ['/messages', '/assistant', '/login', '/register'];
const NO_FAB = ['/messages', '/assistant', '/login', '/register'];

function Layout() {
  const { pathname } = useLocation();
  const showFooter = !NO_FOOTER.includes(pathname);
  const showFab = !NO_FAB.includes(pathname);
  const showExitHint = useAndroidBackButton();

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/become-landlord" element={<BecomeLandlord />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/about" element={<About />} />

          {/* Protected */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/storage" element={<PrivateRoute><StorageBrowse /></PrivateRoute>} />
          <Route path="/storage/:id" element={<PrivateRoute><StorageDetails /></PrivateRoute>} />
          <Route path="/bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
          <Route path="/bookings/new" element={<PrivateRoute><BookingForm /></PrivateRoute>} />
          <Route path="/bookings/:id" element={<PrivateRoute><BookingDetails /></PrivateRoute>} />
          <Route path="/list-space" element={<PrivateRoute><ListSpace /></PrivateRoute>} />
          <Route path="/my-listings" element={<PrivateRoute><MyListings /></PrivateRoute>} />
          <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
          <Route path="/assistant" element={<PrivateRoute><ChatDavid /></PrivateRoute>} />
          <Route path="/favorites" element={<PrivateRoute><ComingSoon title="Favorites" /></PrivateRoute>} />
          <Route path="/payments" element={<PrivateRoute><ComingSoon title="Payments" /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        </Routes>
      </main>
      {showFooter && <Footer />}
      {showFab && <AssistantWidget />}
      {showExitHint && <div className="exit-hint" role="status">Press back again to exit</div>}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout />
      </Router>
    </AuthProvider>
  );
}

export default App;
