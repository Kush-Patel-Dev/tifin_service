import ScrollReveal from '../ScrollReveal/ScrollReveal';
import './Testimonials.css';

const testimonials = [
  {
    stars: 5,
    text: 'Absolutely love TiffinBox! The food tastes exactly like home. As a working professional, this service has been a lifesaver. The weekly plan is perfect.',
    name: 'Priya Sharma',
    loc: 'Software Engineer, Pune',
    initial: 'P',
    gradient: 'linear-gradient(135deg, var(--saffron), var(--saffron-dark))',
  },
  {
    stars: 5,
    text: "The monthly plan saves me so much time and money. The food is always fresh, well-spiced, and delivered on time. Highly recommended for students!",
    name: 'Rahul Patel',
    loc: 'MBA Student, Ahmedabad',
    initial: 'R',
    gradient: 'linear-gradient(135deg, #4A7C59, #2d5a3d)',
  },
  {
    stars: 5,
    text: 'I ordered a custom low-carb plan and they accommodated everything perfectly. The delivery is always on time and the packaging is very hygienic. 10/10!',
    name: 'Anita Mehta',
    loc: 'Fitness Trainer, Mumbai',
    initial: 'A',
    gradient: 'linear-gradient(135deg, #C46D0E, #8B4513)',
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials-section" id="reviews">
      <div className="container">
        <div className="testimonials-header">
          <ScrollReveal>
            <span className="section-tag">Customer Stories</span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="section-title">Loved by Thousands</h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="section-sub mx-auto">
              Don't just take our word for it — hear from our happy subscribers.
            </p>
          </ScrollReveal>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="testimonial-card">
                <div className="testimonial-stars">
                  {'★'.repeat(t.stars)}
                </div>
                <p className="testimonial-text">{t.text}</p>
                <div className="reviewer-info">
                  <div className="reviewer-avatar" style={{ background: t.gradient }}>
                    {t.initial}
                  </div>
                  <div>
                    <div className="reviewer-name">{t.name}</div>
                    <div className="reviewer-loc">{t.loc}</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
