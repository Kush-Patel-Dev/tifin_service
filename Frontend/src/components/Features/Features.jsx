import ScrollReveal from '../ScrollReveal/ScrollReveal';
import './Features.css';

const features = [
  {
    icon: '🥗',
    title: '100% Fresh Ingredients',
    desc: 'We source vegetables and ingredients fresh every morning from local farms, ensuring maximum nutrition and taste.',
  },
  {
    icon: '🚚',
    title: 'On-Time Delivery',
    desc: 'Meals are delivered hot and fresh within your selected time window. We track every order in real-time.',
  },
  {
    icon: '🔄',
    title: 'Flexible Subscriptions',
    desc: 'Choose daily, weekly, or monthly plans. Pause, modify, or cancel anytime — complete flexibility at your fingertips.',
  },
  {
    icon: '🍽️',
    title: 'Customizable Menus',
    desc: 'Have dietary preferences? We accommodate veg, vegan, low-carb, and custom meal plans tailored just for you.',
  },
];

const Features = () => {
  return (
    <section className="features-section" id="features">
      <div className="container">
        <div className="features-header">
          <ScrollReveal>
            <span className="section-tag">Why Choose TiffinBox</span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="section-title">Crafted with Care,<br />Served with Love</h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="section-sub mx-auto">
              We believe everyone deserves a wholesome, home-cooked meal. Our service is built
              around freshness, convenience, and your wellbeing.
            </p>
          </ScrollReveal>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h5>{f.title}</h5>
                <p>{f.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
