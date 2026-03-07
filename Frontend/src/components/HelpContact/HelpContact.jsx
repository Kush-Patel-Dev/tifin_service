import { useState } from 'react';
import ScrollReveal from '../ScrollReveal/ScrollReveal';
import './HelpContact.css';

const faqs = [
  {
    q: 'How does the subscription work?',
    a: 'Choose a plan (daily, weekly, or monthly), customize your meal preferences, and we deliver fresh meals to your doorstep at your chosen time. You can pause, modify, or cancel anytime.',
  },
  {
    q: 'Can I change my meal preferences?',
    a: 'Absolutely! You can update your meal preferences, dietary requirements, and delivery schedule anytime through your account dashboard or by contacting our support team.',
  },
  {
    q: 'What areas do you deliver to?',
    a: 'We currently serve Ahmedabad, Surat, and Rajkot. We are expanding to more cities soon. Enter your PIN code to check delivery availability.',
  },
  {
    q: 'How do I cancel or pause my subscription?',
    a: 'You can pause or cancel your subscription anytime from your account settings. There are no cancellation fees or long-term commitments. Pauses can be scheduled in advance.',
  },
  {
    q: 'Is the food safe and hygienic?',
    a: 'Yes! We follow strict food safety standards. Our kitchen is FSSAI certified, and all meals are prepared in a temperature-controlled environment with fresh ingredients sourced daily.',
  },
];

const HelpContact = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? -1 : index);
  };

  return (
    <section className="help-section" id="help">
      <div className="container">
        <div className="help-header">
          <ScrollReveal>
            <span className="section-tag">Help & Support</span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="section-title">We're Here to Help</h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="section-sub mx-auto">
              Have questions? Find answers below or reach out to our friendly support team.
            </p>
          </ScrollReveal>
        </div>

        <div className="help-layout">
          <ScrollReveal>
            <div className="faq-container">
              <h3>Frequently Asked Questions</h3>
              {faqs.map((faq, i) => (
                <div className={`faq-item${openFaq === i ? ' open' : ''}`} key={i}>
                  <button className="faq-question" onClick={() => toggleFaq(i)}>
                    {faq.q}
                    <span className="faq-icon">+</span>
                  </button>
                  {openFaq === i && (
                    <div className="faq-answer">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="contact-container">
              <h3>Get in Touch</h3>
              <div className="contact-form">
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input className="form-input" type="text" placeholder="John Doe" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" placeholder="you@example.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input className="form-input" type="text" placeholder="How can we help?" />
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-input"
                    rows="4"
                    placeholder="Tell us more about your query..."
                    style={{ resize: 'vertical', minHeight: '100px' }}
                  ></textarea>
                </div>
                <button className="btn-contact-submit">Send Message</button>
              </div>

              <div className="contact-info-cards">
                <div className="contact-info-card">
                  <div className="contact-info-icon">
                    <i className="bi bi-telephone"></i>
                  </div>
                  <div>
                    <div className="contact-info-label">Phone</div>
                    <div className="contact-info-value">+91 99248 94483</div>
                  </div>
                </div>
                <div className="contact-info-card">
                  <div className="contact-info-icon">
                    <i className="bi bi-envelope"></i>
                  </div>
                  <div>
                    <div className="contact-info-label">Email</div>
                    <div className="contact-info-value">hello@tiffinbox.in</div>
                  </div>
                </div>
                <div className="contact-info-card">
                  <div className="contact-info-icon">
                    <i className="bi bi-geo-alt"></i>
                  </div>
                  <div>
                    <div className="contact-info-label">Serving Areas</div>
                    <div className="contact-info-value">Bhavnagar, Gujarat</div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default HelpContact;
