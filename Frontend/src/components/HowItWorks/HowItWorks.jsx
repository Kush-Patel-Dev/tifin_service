import { FaCalendarCheck, FaTags, FaFire } from 'react-icons/fa';
import DeliveryIcon from './DeliveryIcon';
import ScrollReveal from '../ScrollReveal/ScrollReveal';
import './HowItWorks.css';

const steps = [
  {
    num: '01',
    icon: <FaCalendarCheck />,
    title: 'Choose Your Plan',
    desc: 'Browse daily, weekly, or monthly subscription options that suit your needs.',
  },
  {
    num: '02',
    icon: <FaTags />,
    title: 'Customize Menu',
    desc: 'Select your preferred dishes or let our chefs surprise you with daily specials.',
  },
  {
    num: '03',
    icon: <FaFire />,
    title: 'We Cook Fresh',
    desc: 'Our chefs prepare your meals fresh each morning using quality ingredients.',
  },
  {
    num: '04',
    icon: <DeliveryIcon size={32} />,
    title: 'Delivered Hot',
    desc: 'Your tiffin is packed hygienically and delivered on time to your address.',
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

        <div className="how-unique-grid">
          {steps.map((step, i) => (
            <ScrollReveal key={i} delay={i * 0.15}>
              <div className="how-unique-card">
                <div className="how-bg-number">{step.num}</div>
                {step.icon && <div className="how-icon-box">{step.icon}</div>}
                <h4 className="how-step-title">{step.title}</h4>
                <p className="how-step-desc">{step.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
