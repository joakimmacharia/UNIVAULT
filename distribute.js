const fs = require('fs');
const path = require('path');

const member1 = [
  'frontend/src/pages/Landing.jsx',
  'frontend/src/pages/Login.jsx',
  'frontend/src/pages/Register.jsx',
  'frontend/src/pages/Profile.jsx',
  'frontend/src/pages/About.jsx',
  'frontend/src/pages/HelpCenter.jsx',
  'frontend/src/pages/ComingSoon.jsx',
  'frontend/src/components/Navbar.jsx',
  'frontend/src/components/Footer.jsx',
  'frontend/src/components/PrivateRoute.jsx',
  'frontend/src/components/ui/Logo.jsx',
  'frontend/src/components/ui/Avatar.jsx',
  'frontend/src/context/AuthContext.jsx',
  'frontend/src/services/api.js',
  'frontend/src/styles/base.css',
  'frontend/src/styles/landing.css',
  'frontend/src/App.jsx',
  'frontend/src/main.jsx',
  'frontend/src/index.css'
];

const member2 = [
  'frontend/src/pages/Dashboard.jsx',
  'frontend/src/pages/AdminDashboard.jsx',
  'frontend/src/pages/StorageBrowse.jsx',
  'frontend/src/pages/StorageDetails.jsx',
  'frontend/src/pages/BookingForm.jsx',
  'frontend/src/pages/BookingDetails.jsx',
  'frontend/src/pages/MyBookings.jsx',
  'frontend/src/pages/ListSpace.jsx',
  'frontend/src/pages/MyListings.jsx',
  'frontend/src/pages/Messages.jsx',
  'frontend/src/pages/ChatDavid.jsx',
  'frontend/src/pages/BecomeLandlord.jsx',
  'frontend/src/components/DashboardLayout.jsx',
  'frontend/src/components/StorageCard.jsx',
  'frontend/src/components/CheckoutModal.jsx',
  'frontend/src/components/AssistantWidget.jsx',
  'frontend/src/components/LoadingSpinner.jsx',
  'frontend/src/hooks/useAndroidBackButton.js',
  'frontend/src/data/assets.js',
  'frontend/src/data/navigation.js',
  'frontend/src/styles/components.css',
  'frontend/src/styles/pages.css',
  'frontend/src/styles/responsive.css'
];

const member3 = [
  'backend/Controllers/authController.js',
  'backend/Controllers/adminController.js',
  'backend/Routes/authRoutes.js',
  'backend/Routes/adminRoutes.js',
  'backend/Middleware/authMiddleware.js',
  'backend/Middleware/adminMiddleware.js',
  'database/profiles.sql',
  'database/phase2_admin_pin.sql',
  'backend/server.js',
  'backend/.env',
  'backend/.env.example'
];

const member4 = [
  'backend/Controllers/storageController.js',
  'backend/Controllers/bookingController.js',
  'backend/Controllers/assistantController.js',
  'backend/Routes/storageRoutes.js',
  'backend/Routes/bookingRoutes.js',
  'backend/Routes/assistantRoutes.js',
  'database/storage_and_bookings.sql',
  'backend/supabaseClient.js'
];

const distributions = {
  '1': member1,
  '2': member2,
  '3': member3,
  '4': member4
};

const baseDir = process.cwd();
const outputDir = path.join(baseDir, 'team_distribution');

Object.entries(distributions).forEach(([member, files]) => {
  const memberDir = path.join(outputDir, member);
  
  if (!fs.existsSync(memberDir)) {
    fs.mkdirSync(memberDir, { recursive: true });
  }

  files.forEach(file => {
    const sourcePath = path.join(baseDir, file);
    const destPath = path.join(memberDir, file);

    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
    }
  });
});
