import { useState } from 'react';
import ScrollReveal from '../ScrollReveal/ScrollReveal';
import './MenuPreview.css';

import pohaImg from '../../assets/poha.jpg';
import parathaImg from '../../assets/spicy-potato-stuffed-paratha-popular-street-food-aloo-paratha-alu-paratha-picture_1020697-123521.jpg';
import upmaImg from '../../assets/o0k32qmg_upma_625x300_10_July_23.jpg';
import idliImg from '../../assets/professional-food-photography-of-idli-with-chutney_1177187-245461.jpg';
import dalTadkaImg from '../../assets/india-food-dal-tadka.jpg';
import rajmaImg from '../../assets/OIP.jpg';
import choleBhatureImg from '../../assets/Chloe-Bhature.jpg';
import biryaniImg from '../../assets/biryani.jpg';
import khichdiImg from '../../assets/khichdi.jpg';
import paneerImg from '../../assets/aesthetic-paneer-butter-masala_864588-20269.jpg';
import rotiSabziImg from '../../assets/roti-sabzi-new.png';
import soupImg from '../../assets/soup-saladbowl.jpg';



const menuData = {
  breakfast: [
    { image: pohaImg, name: 'Poha with Chutney', desc: 'Light flattened rice with coconut chutney', price: '₹60', cal: '280 kcal' },
    { image: parathaImg, name: 'Stuffed Paratha', desc: 'Aloo paratha with fresh curd & pickle', price: '₹80', cal: '420 kcal' },
    { image: upmaImg, name: 'Upma & Sambar', desc: 'South Indian semolina with lentil soup', price: '₹70', cal: '310 kcal' },
    { image: idliImg, name: 'Idli Vada Combo', desc: '3 idlis + 1 vada with chutneys', price: '₹90', cal: '380 kcal' },
  ],
  lunch: [
    { image: dalTadkaImg, name: 'Dal Tadka Thali', desc: '2 rotis, rice, dal, sabzi, salad', price: '₹120', cal: '650 kcal' },
    { image: rajmaImg, name: 'Rajma Rice', desc: 'Kidney beans curry with steamed rice', price: '₹110', cal: '580 kcal' },
    { image: choleBhatureImg, name: 'Chole Bhature', desc: 'Spiced chickpeas with fluffy bhature', price: '₹100', cal: '720 kcal' },
    { image: biryaniImg, name: 'biryani', desc: 'Aromatic basmati rice with vegetables', price: '₹130', cal: '600 kcal' },
  ],
  dinner: [
    { image: khichdiImg, name: 'Light Khichdi', desc: 'Comforting dal-rice khichdi with ghee', price: '₹90', cal: '420 kcal' },
    { image: paneerImg, name: 'Paneer Butter Masala', desc: 'Rich tomato gravy with soft paneer', price: '₹140', cal: '550 kcal' },
    { image: rotiSabziImg, name: 'Roti Sabzi Combo', desc: '3 rotis with seasonal vegetable curry', price: '₹100', cal: '480 kcal' },
    { image: soupImg, name: 'Soup + Salad Bowl', desc: 'Light dinner with fresh greens', price: '₹85', cal: '280 kcal' },
  ],
};

const tabs = [
  { key: 'breakfast', label: '🌅 Breakfast' },
  { key: 'lunch', label: '☀️ Lunch' },
  { key: 'dinner', label: '🌙 Dinner' },
];

const MenuPreview = () => {
  const [activeTab, setActiveTab] = useState('breakfast');

  return (
    <section className="menu-section" id="menu">
      <div className="container">
        <div className="menu-header">
          <ScrollReveal>
            <span className="section-tag">Today's Menu</span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="section-title">Freshly Prepared,<br />Every Single Day</h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="section-sub mx-auto">
              Our chefs rotate dishes daily to keep meals exciting and nutritionally balanced.
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <div className="menu-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`menu-tab${activeTab === tab.key ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <div className="row justify-content-center">
          {menuData[activeTab].map((item, i) => (
            <div className="col-lg-3 col-md-6 col-12 mb-4" key={`${activeTab}-${i}`}>
              <ScrollReveal delay={i * 0.08} className="h-100">
                <div className="menu-item-card h-100">
                  <div className="menu-item-img">
                    {item.image ? <img src={item.image} alt={item.name} className="menu-item-image" /> : item.icon}
                  </div>
                  <div className="menu-item-body">
                    <div className="menu-item-name">{item.name}</div>
                    <div className="menu-item-desc">{item.desc}</div>
                    <div className="menu-item-footer">
                      <div className="menu-item-price">{item.price}</div>
                      <div className="menu-item-cal">{item.cal}</div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuPreview;
