import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { createDefaultAdmin } from "./firebase/firebase";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Features from "./components/Features/Features";
import MealPlans from "./components/MealPlans/MealPlans";
import MenuPreview from "./components/MenuPreview/MenuPreview";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import Testimonials from "./components/Testimonials/Testimonials";
import About from "./components/About/About";
import TiffinDetails from "./components/TiffinDetails/TiffinDetails";
import CallToAction from "./components/CallToAction/CallToAction";
import HelpContact from "./components/HelpContact/HelpContact";
import Footer from "./components/Footer/Footer";
import AuthModal from "./components/AuthModal/AuthModal";
import SubscriptionModal from "./components/SubscriptionModal/SubscriptionModal";
import ToastAlert from "./components/ToastAlert/ToastAlert";
import { showToast } from "./utils/toastService";
import DashboardLayout from "./dashboard/DashboardLayout";
import UserProfile from "./dashboard/UserProfile";
import MyApplications from "./dashboard/MyApplications";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import AdminLayout from "./dashboard/admin/AdminLayout";
import AdminDashboard from "./dashboard/admin/AdminDashboard";
import UsersList from "./dashboard/admin/UsersList";
import InquiryList from "./dashboard/admin/InquiryList";
import SubscriptionList from "./dashboard/admin/SubscriptionList";
import MealManager from "./dashboard/admin/MealManager";
import CsvExport from "./dashboard/admin/CsvExport";
import AdminAbout from "./dashboard/admin/About";

function App() {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [showSubscription, setShowSubscription] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const handleOrderSuccess = () => {
    showToast("success", "Subscription confirmed! We'll contact you shortly.");
  };

  const handleOpenSubscription = (planName = null) => {
    setSelectedPlan(planName);
    setShowSubscription(true);
  };

  useEffect(() => {
    // Ensure default admin exists in Firestore on first app load
    createDefaultAdmin().catch((err) => console.error(err));
  }, []);

  return (
    <>
      {/** Hide main Navbar for dashboard and admin routes to avoid duplicate navbars */}
      {(() => {
        const location = useLocation();
        const isDashboard = location.pathname.startsWith("/dashboard");
        const isAdmin = location.pathname.startsWith("/admin");
        return (
          !isDashboard && !isAdmin && (
            <Navbar
              onSignIn={() => {
                setAuthMode("signin");
                setShowAuth(true);
              }}
              onOrderNow={() => handleOpenSubscription()}
            />
          )
        );
      })()}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero onOrderNow={() => handleOpenSubscription()} />
              <Features />
              <MealPlans onOrderNow={handleOpenSubscription} />
              <MenuPreview />
              <HowItWorks />
              <About />
              <Testimonials />
              <TiffinDetails onOrderNow={() => handleOpenSubscription()} />
              <CallToAction onOrderNow={() => handleOpenSubscription()} />
              <HelpContact />
              <Footer />
            </>
          }
        />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="profile" element={<UserProfile />} />
          <Route path="my-applications" element={<MyApplications />} />
        </Route>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/about-admin" element={<AdminAbout />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UsersList />} />
          <Route path="inquiries" element={<InquiryList />} />
          <Route path="subscriptions" element={<SubscriptionList />} />
          <Route path="meals" element={<MealManager />} />
          <Route path="csv" element={<CsvExport />} />
        </Route>
      </Routes>

      {/* Modals */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        initialMode={authMode}
      />
      <SubscriptionModal
        isOpen={showSubscription}
        onClose={() => setShowSubscription(false)}
        onSuccess={handleOrderSuccess}
        initialPlan={selectedPlan}
      />

      {/* Global Toasts */}
      <ToastAlert />
    </>
  );
}

export default App;
