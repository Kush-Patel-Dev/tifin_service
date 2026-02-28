import ScrollReveal from '../ScrollReveal/ScrollReveal';
import './HowItWorks.css';

const steps = [
  {
    num: 1,
    title: 'Choose Your Plan',
    desc: 'Browse daily, weekly, or monthly subscription options that suit your needs.',
    showConnector: true,
  },
  {
    num: 2,
    title: 'Customize Menu',
    desc: 'Select your preferred dishes or let our chefs surprise you with daily specials.',
    showConnector: true,
  },
  {
    num: 3,
    title: 'We Cook Fresh',
    desc: 'Our chefs prepare your meals fresh each morning using quality ingredients.',
    showConnector: true,
  },
  {
    num: 4,
    title: 'Delivered Hot',
    desc: 'Your tiffin is packed hygienically and delivered on time to your address.',
    showConnector: false,
  },
];

const HowItWorks = () => {
  return (
    <section className="how-section" id="how">
      <div className="container">
        <div className="how-header">
          <ScrollReveal>
            <span className="section-tag">Simple Process</span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="section-title">How TiffinBox Works</h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="section-sub mx-auto">
              Getting started takes less than 3 minutes. Fresh meals from your door in no time.
            </p>
          </ScrollReveal>
        </div>
        <div className="steps-grid">
          {steps.map((step, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="step-card">
                {step.showConnector && <div className="step-connector"></div>}
                <div className="step-number">{step.num}</div>
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.desc}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
