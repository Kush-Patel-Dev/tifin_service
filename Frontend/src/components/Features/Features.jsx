import { FaLeaf, FaTruck, FaSyncAlt, FaUtensils } from "react-icons/fa";
import ScrollReveal from "../ScrollReveal/ScrollReveal";
import "./Features.css";

const features = [
  {
    icon: <FaLeaf size={28} />,
    title: "100% Fresh Ingredients",
    desc: "We source vegetables and ingredients fresh every morning from local farms, ensuring maximum nutrition and taste.",
  },
  {
    icon: <FaTruck size={28} />,
    title: "On-Time Delivery",
    desc: "Meals are delivered hot and fresh within your selected time window. We track every order in real-time.",
  },
  {
    icon: <FaSyncAlt size={28} />,
    title: "Flexible Subscriptions",
    desc: "Choose daily, weekly, or monthly plans. Pause, modify, or cancel anytime — complete flexibility at your fingertips.",
  },
  {
    icon: <FaUtensils size={28} />,
    title: "Customizable Menus",
    desc: "Have dietary preferences? We accommodate veg, vegan, low-carb, and custom meal plans tailored just for you.",
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
            <h2 className="section-title">
              Crafted with Care,
              <br />
              Served with Love
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="section-sub mx-auto">
              We believe everyone deserves a wholesome, home-cooked meal. Our
              service is built around freshness, convenience, and your
              wellbeing.
            </p>
          </ScrollReveal>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-item-wrapper" key={i}>
              <ScrollReveal delay={i * 0.1} className="h-100">
                <div className="feature-card premium-card">
                  <div className="card-glow"></div>
                  <div className="feature-icon-wrapper">
                    <div className="icon-glow"></div>
                    <div className="feature-icon">{f.icon}</div>
                  </div>
                  <h5 className="feature-title">{f.title}</h5>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
