import { Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Features from "./components/Features/Features";
import MealPlans from "./components/MealPlans/MealPlans";
import MenuPreview from "./components/MenuPreview/MenuPreview";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import Testimonials from "./components/Testimonials/Testimonials";
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

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [showSubscription, setShowSubscription] = useState(false);
  const handleOrderSuccess = () => {
    showToast("success", "Subscription confirmed! We'll contact you shortly.");
  };

  return (
    <>
      {/** Hide main Navbar for dashboard routes to avoid duplicate navbars */}
      {(() => {
        const location = useLocation();
        const isDashboard = location.pathname.startsWith("/dashboard");
        return (
          !isDashboard && (
            <Navbar
              onSignIn={() => {
                setAuthMode("signin");
                setShowAuth(true);
              }}
              onOrderNow={() => setShowSubscription(true)}
            />
          )
        );
      })()}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero onOrderNow={() => setShowSubscription(true)} />
              <Features />
              <MealPlans onOrderNow={() => setShowSubscription(true)} />
              <MenuPreview />
              <HowItWorks />
              <Testimonials />
              <TiffinDetails onOrderNow={() => setShowSubscription(true)} />
              <CallToAction onOrderNow={() => setShowSubscription(true)} />
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
      />

      {/* Global Toasts */}
      <ToastAlert />
    </>
  );
}

export default App;
