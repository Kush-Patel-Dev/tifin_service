import ScrollReveal from '../ScrollReveal/ScrollReveal';
import './CallToAction.css';

const CallToAction = ({ onOrderNow }) => {
  return (
    <section className="cta-section">
      <div className="container">
        <ScrollReveal>
          <div className="cta-inner">
            <h2>Ready for Your First Tiffin?</h2>
            <p>Join 5,000+ happy subscribers. First week free on monthly plans. No commitment required.</p>
            <div className="cta-actions">
              <button className="btn-cta-white" onClick={onOrderNow}>
                Start My Subscription
              </button>
              <a
                href="#how"
                className="btn-cta-outline"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#how')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Learn More
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CallToAction;
