import ScrollReveal from '../ScrollReveal/ScrollReveal';
import './TiffinDetails.css';

const tiffins = [
  {
    icon: '🍛',
    name: 'Classic Indian Thali',
    desc: 'A complete traditional meal with dal, sabzi, roti, rice, pickles, and papad. Perfectly balanced and deeply satisfying.',
    type: 'Veg',
    price: '₹120',
    nutrition: { cal: '650', protein: '18g', carbs: '85g', fat: '22g' },
    ingredients: ['Toor Dal', 'Basmati Rice', 'Wheat Roti', 'Seasonal Sabzi', 'Pickle', 'Papad'],
  },
  {
    icon: '🥘',
    name: 'Premium Paneer Thali',
    desc: 'Rich paneer curry with butter naan, jeera rice, raita, and gulab jamun dessert. A premium dining experience.',
    type: 'Premium',
    price: '₹180',
    nutrition: { cal: '820', protein: '28g', carbs: '78g', fat: '38g' },
    ingredients: ['Paneer', 'Butter Naan', 'Jeera Rice', 'Raita', 'Gulab Jamun', 'Salad'],
  },
  {
    icon: '🥗',
    name: 'Healthy Fit Bowl',
    desc: 'Low-carb, high-protein meal with grilled veggies, quinoa, hummus, and mixed greens. Perfect for fitness enthusiasts.',
    type: 'Low-Carb',
    price: '₹160',
    nutrition: { cal: '420', protein: '24g', carbs: '35g', fat: '18g' },
    ingredients: ['Quinoa', 'Grilled Veggies', 'Hummus', 'Mixed Greens', 'Avocado', 'Seeds'],
  },
];

const TiffinDetails = ({ onOrderNow }) => {
  return (
    <section className="tiffin-section" id="tiffin-details">
      <div className="container">
        <div className="tiffin-header">
          <ScrollReveal>
            <span className="section-tag">Our Tiffins</span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="section-title">Explore Our Tiffin Options</h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="section-sub mx-auto">
              Each tiffin is carefully curated with balanced nutrition, fresh ingredients,
              and authentic flavors. Explore what's inside every box.
            </p>
          </ScrollReveal>
        </div>
        <div className="tiffin-grid">
          {tiffins.map((t, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="tiffin-card">
                <div className="tiffin-card-img">
                  <div className="tiffin-type-badge">{t.type}</div>
                  {t.icon}
                </div>
                <div className="tiffin-card-body">
                  <div className="tiffin-card-name">{t.name}</div>
                  <div className="tiffin-card-desc">{t.desc}</div>

                  <div className="tiffin-nutrition">
                    <div className="nutrition-item">
                      <div className="nutrition-value">{t.nutrition.cal}</div>
                      <div className="nutrition-label">Calories</div>
                    </div>
                    <div className="nutrition-item">
                      <div className="nutrition-value">{t.nutrition.protein}</div>
                      <div className="nutrition-label">Protein</div>
                    </div>
                    <div className="nutrition-item">
                      <div className="nutrition-value">{t.nutrition.carbs}</div>
                      <div className="nutrition-label">Carbs</div>
                    </div>
                    <div className="nutrition-item">
                      <div className="nutrition-value">{t.nutrition.fat}</div>
                      <div className="nutrition-label">Fat</div>
                    </div>
                  </div>

                  <div className="tiffin-ingredients">
                    {t.ingredients.map((ing, j) => (
                      <span className="ingredient-tag" key={j}>{ing}</span>
                    ))}
                  </div>

                  <div className="tiffin-card-footer">
                    <div className="tiffin-price">{t.price}</div>
                    <button className="btn-add-tiffin" onClick={onOrderNow}>
                      Order Now
                    </button>
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

export default TiffinDetails;
