import React from 'react';
import './About.css';
import ScrollReveal from '../ScrollReveal/ScrollReveal';

const About = () => {
  return (
    <section className="about-section" id="about">
      <div className="container">
        <ScrollReveal>
          <div className="about-card">
            <h2 className="about-title">About Food Box</h2>
            <p className="about-text">
              At Food Box, we bring the authentic taste of homemade food to your busy life. 
              Our meals are prepared with the same care, love, and traditional recipes that you 
              deserve. We use only the freshest ingredients, avoid artificial additives, 
              and cook in small batches to ensure quality. Whether you're a busy professional, 
              a student away from home, or just craving healthy food, Food Box is your 
              solution for nutritious, delicious meals.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default About;
