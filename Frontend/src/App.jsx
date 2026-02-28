import { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Features from './components/Features/Features';
import MealPlans from './components/MealPlans/MealPlans';
import MenuPreview from './components/MenuPreview/MenuPreview';
import HowItWorks from './components/HowItWorks/HowItWorks';
import Testimonials from './components/Testimonials/Testimonials';
import TiffinDetails from './components/TiffinDetails/TiffinDetails';
import CallToAction from './components/CallToAction/CallToAction';
import HelpContact from './components/HelpContact/HelpContact';
import Footer from './components/Footer/Footer';
import AuthModal from './components/AuthModal/AuthModal';
import SubscriptionModal from './components/SubscriptionModal/SubscriptionModal';

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleOrderSuccess = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <>
      <Navbar
        onSignIn={() => setShowAuth(true)}
        onOrderNow={() => setShowSubscription(true)}
      />
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

      {/* Modals */}
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      <SubscriptionModal
        isOpen={showSubscription}
        onClose={() => setShowSubscription(false)}
        onSuccess={handleOrderSuccess}
      />

      {/* Success Toast */}
      {showToast && (
        <div className="toast">
          🎉 Subscription confirmed! We'll contact you shortly.
        </div>
      )}
    </>
  );
}

export default App;
