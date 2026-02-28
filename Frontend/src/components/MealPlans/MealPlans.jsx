import ScrollReveal from '../ScrollReveal/ScrollReveal';
import './MealPlans.css';

const plans = [
  {
    icon: '☀️',
    name: 'Daily Plan',
    desc: 'Perfect for trying us out',
    price: '120',
    period: 'per meal',
    featured: false,
    badge: null,
    buttonText: 'Get Started',
    features: [
      { text: '1 meal per day', included: true },
      { text: 'Lunch or Dinner', included: true },
      { text: 'Standard menu', included: true },
      { text: 'Free delivery on orders ₹200+', included: true },
      { text: 'Menu customization', included: false },
    ],
  },
  {
    icon: '📅',
    name: 'Weekly Plan',
    desc: 'Best value for regulars',
    price: '799',
    period: 'per week',
    featured: true,
    badge: 'Most Popular',
    buttonText: 'Subscribe Now',
    features: [
      { text: '2 meals/day (Lunch + Dinner)', included: true },
      { text: '7 days coverage', included: true },
      { text: 'Rotating weekly menu', included: true },
      { text: 'Free delivery always', included: true },
      { text: 'Basic customization', included: true },
    ],
  },
  {
    icon: '🗓️',
    name: 'Monthly Plan',
    desc: 'Maximum savings & convenience',
    price: '2,499',
    period: 'per month',
    featured: false,
    badge: null,
    buttonText: 'Get Started',
    features: [
      { text: '3 meals/day', included: true },
      { text: '30 days coverage', included: true },
      { text: 'Premium menu access', included: true },
      { text: 'Priority delivery', included: true },
      { text: 'Full menu customization', included: true },
    ],
  },
];

const MealPlans = ({ onOrderNow }) => {
  return (
    <section className="plans-section" id="plans">
      <div className="container">
        <div className="plans-header">
          <ScrollReveal>
            <span className="section-tag">Our Subscription Plans</span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="section-title">Simple, Transparent Pricing</h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="section-sub mx-auto">
              No hidden costs, no surprises. Pick the plan that fits your lifestyle.
            </p>
          </ScrollReveal>
        </div>
        <div className="plans-grid">
          {plans.map((plan, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className={`plan-card${plan.featured ? ' featured' : ''}`}>
                {plan.badge && <div className="plan-badge">{plan.badge}</div>}
                <div className="plan-header">
                  <div className="plan-icon">{plan.icon}</div>
                  <div className="plan-name">{plan.name}</div>
                  <div className="plan-desc">{plan.desc}</div>
                </div>
                <div className="plan-price-wrap">
                  <span className="plan-price"><sup>₹</sup>{plan.price}</span>
                  <span className="plan-period">{plan.period}</span>
                </div>
                <div className="plan-features">
                  {plan.features.map((f, j) => (
                    <div className="plan-feature-item" key={j}>
                      <i className={`bi ${f.included ? 'bi-check-circle-fill' : 'bi-x-circle excluded'}`}></i>
                      {f.text}
                    </div>
                  ))}
                </div>
                <button
                  className={`btn-plan${plan.featured ? ' active' : ''}`}
                  onClick={onOrderNow}
                >
                  {plan.buttonText}
                </button>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MealPlans;
