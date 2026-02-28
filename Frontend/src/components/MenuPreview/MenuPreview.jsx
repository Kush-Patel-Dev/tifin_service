import { useState } from 'react';
import ScrollReveal from '../ScrollReveal/ScrollReveal';
import './MenuPreview.css';

const menuData = {
  breakfast: [
    { icon: '🥣', name: 'Poha with Chutney', desc: 'Light flattened rice with coconut chutney', price: '₹60', cal: '280 kcal' },
    { icon: '🫔', name: 'Stuffed Paratha', desc: 'Aloo paratha with fresh curd & pickle', price: '₹80', cal: '420 kcal' },
    { icon: '🥛', name: 'Upma & Sambar', desc: 'South Indian semolina with lentil soup', price: '₹70', cal: '310 kcal' },
    { icon: '🥞', name: 'Idli Vada Combo', desc: '3 idlis + 1 vada with chutneys', price: '₹90', cal: '380 kcal' },
  ],
  lunch: [
    { icon: '🍛', name: 'Dal Tadka Thali', desc: '2 rotis, rice, dal, sabzi, salad', price: '₹120', cal: '650 kcal' },
    { icon: '🍲', name: 'Rajma Rice', desc: 'Kidney beans curry with steamed rice', price: '₹110', cal: '580 kcal' },
    { icon: '🥘', name: 'Chole Bhature', desc: 'Spiced chickpeas with fluffy bhature', price: '₹100', cal: '720 kcal' },
    { icon: '🍱', name: 'Veg Biryani', desc: 'Aromatic basmati rice with vegetables', price: '₹130', cal: '600 kcal' },
  ],
  dinner: [
    { icon: '🥗', name: 'Light Khichdi', desc: 'Comforting dal-rice khichdi with ghee', price: '₹90', cal: '420 kcal' },
    { icon: '🫕', name: 'Paneer Butter Masala', desc: 'Rich tomato gravy with soft paneer', price: '₹140', cal: '550 kcal' },
    { icon: '🍜', name: 'Roti Sabzi Combo', desc: '3 rotis with seasonal vegetable curry', price: '₹100', cal: '480 kcal' },
    { icon: '🍮', name: 'Soup + Salad Bowl', desc: 'Light dinner with fresh greens', price: '₹85', cal: '280 kcal' },
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

        <div className="menu-grid">
          {menuData[activeTab].map((item, i) => (
            <ScrollReveal key={`${activeTab}-${i}`} delay={i * 0.08}>
              <div className="menu-item-card">
                <div className="menu-item-img">{item.icon}</div>
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuPreview;
