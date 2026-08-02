import { useState, useEffect } from "react";
import ScrollReveal from "../ScrollReveal/ScrollReveal";
import "./MenuPreview.css";

import { db } from "../../firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";

const tabs = [
  { key: "Breakfast", label: "🌅 Breakfast" },
  { key: "Lunch", label: "☀️ Lunch" },
  { key: "Dinner", label: "🌙 Dinner" },
];

const MenuPreview = () => {
  const [activeTab, setActiveTab] = useState("Breakfast");
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    // Fail-safe: Ensure loading state is eventually resolved
    const timeout = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 5000);

    const fetchMeals = async () => {
      if (!db) return;
      try {
        const mealsRef = collection(db, "meals");
        
        // Use onSnapshot for real-time updates (Main listener)
        const unsubscribe = onSnapshot(
          mealsRef,
          (snapshot) => {
            if (!isMounted) return;
            let mealData = snapshot.docs.map((doc) => {
              const data = doc.data();
              if (
                data.menuType === "Breakfast" &&
                (data.mealName || "").toLowerCase().includes("idli")
              ) {
                return {
                  id: doc.id,
                  ...data,
                  mealName: "Idli Vada Combo",
                  imageUrl: "/images/meals/idli-vada-combo.jpg",
                };
              }
              return { id: doc.id, ...data };
            });
            const hasIdliCombo = mealData.some(
              (m) =>
                m.menuType === "Breakfast" &&
                (m.mealName || "").toLowerCase() === "idli vada combo"
            );
            if (!hasIdliCombo) {
              mealData = [
                {
                  id: "default-idli-combo",
                  mealName: "Idli Vada Combo",
                  menuType: "Breakfast",
                  description:
                    "Soft steamed idlis & crispy medu vadas served with fresh coconut chutney and sambar.",
                  price: 80,
                  imageUrl: "/images/meals/idli-vada-combo.jpg",
                  isActive: true,
                },
                ...mealData,
              ];
            }
            setMeals(mealData);
            setLoading(false);
            clearTimeout(timeout);
          },
          (error) => {
            console.error("Firestore error:", error);
            if (isMounted) setLoading(false);
          }
        );

        return unsubscribe;
      } catch (err) {
        console.error("Fetch initialization error:", err);
        if (isMounted) setLoading(false);
      }
    };

    const unsubscribePromise = fetchMeals();
    
    return () => {
      isMounted = false;
      clearTimeout(timeout);
      unsubscribePromise.then(unsub => unsub && unsub());
    };
  }, []);

  const getMealImage = (item) => {
    const name = (item.mealName || "").toLowerCase();
    if (name.includes("idli") || name.includes("vada") || name.includes("combo")) {
      return "/images/meals/idli-vada-combo.jpg";
    }
    if (item.imageUrl && item.imageUrl.trim() !== "") {
      return item.imageUrl;
    }
    if (name.includes("poha")) return "/images/meals/poha.jpg";
    if (name.includes("thali")) return "/images/meals/thali.jpg";
    if (name.includes("chole") || name.includes("bhature")) return "/images/meals/Chloe-Bhature.jpg";
    if (name.includes("biryani")) return "/images/meals/biryani.jpg";
    if (name.includes("dal")) return "/images/meals/india-food-dal-tadka.jpg";
    if (name.includes("khichdi")) return "/images/meals/khichdi.jpg";
    if (name.includes("paneer")) return "/images/meals/aesthetic-paneer-butter-masala_864588-20269.jpg";
    if (name.includes("paratha")) return "/images/meals/spicy-potato-stuffed-paratha-popular-street-food-aloo-paratha-alu-paratha-picture_1020697-123521.jpg";
    if (name.includes("roti") || name.includes("sabzi")) return "/images/meals/roti-sabzi combo.jpg";
    if (name.includes("upma")) return "/images/meals/o0k32qmg_upma_625x300_10_July_23.jpg";
    if (name.includes("soup") || name.includes("salad")) return "/images/meals/soup-saladbowl.jpg";
    return null;
  };

  let filteredMeals = meals.filter((meal) => meal.menuType === activeTab);
  if (activeTab === "Breakfast") {
    const hasIdli = filteredMeals.some((m) =>
      (m.mealName || "").toLowerCase().includes("idli")
    );
    if (!hasIdli) {
      filteredMeals = [
        {
          id: "default-idli-combo",
          mealName: "Idli Vada Combo",
          menuType: "Breakfast",
          description:
            "Soft steamed idlis & crispy medu vadas served with fresh coconut chutney and sambar.",
          price: 80,
          imageUrl: "/images/meals/idli-vada-combo.jpg",
          isActive: true,
        },
        ...filteredMeals,
      ];
    }
  }

  return (
    <section className="menu-section" id="menu">
      <div className="container">
        <div className="menu-header">
          <ScrollReveal>
            <span className="section-tag">Today's Menu</span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="section-title">
              Freshly Prepared,
              <br />
              Every Single Day
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="section-sub mx-auto">
              Our chefs rotate dishes daily to keep meals exciting and
              nutritionally balanced.
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <div className="menu-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`menu-tab${activeTab === tab.key ? " active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <div className="row justify-content-center">
          {loading ? (
            <div className="col-12 text-center py-5">
              <p style={{ color: "rgba(255,255,255,0.6)" }}>Loading menu...</p>
            </div>
          ) : filteredMeals.length > 0 ? (
            filteredMeals.map((item, i) => (
              <div className="col-lg-3 col-md-6 col-12 mb-4" key={item.id}>
                <ScrollReveal delay={i * 0.08} className="h-100">
                  <div className="menu-item-card h-100">
                    <div className="menu-item-img">
                      {getMealImage(item) ? (
                        <img
                          src={getMealImage(item)}
                          alt={item.mealName}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span>🍽️</span>
                      )}
                    </div>
                    <div className="menu-item-body">
                      <div className="menu-item-name">{item.mealName}</div>
                      <div className="menu-item-desc">{item.description}</div>
                      <div className="menu-item-footer">
                        <div className="menu-item-price">₹{item.price}</div>
                        <div className="menu-item-cal">
                          {item.mealName?.toLowerCase().includes("poha") &&
                          item.mealName?.toLowerCase().includes("chutney")
                            ? "280 kcal"
                            : item.mealName?.toLowerCase().includes("paratha")
                              ? "420 kcal"
                              : item.mealName?.toLowerCase().includes("upma")
                                ? "310 kcal"
                                : item.mealName
                                      ?.toLowerCase()
                                      .includes("idli") ||
                                    item.mealName
                                      ?.toLowerCase()
                                      .includes("vada")
                                  ? "380 kcal"
                                  : item.mealName
                                        ?.toLowerCase()
                                        .includes("dal tadka")
                                    ? "650 kcal"
                                    : item.mealName
                                          ?.toLowerCase()
                                          .includes("khichdi")
                                      ? "420 kcal"
                                      : item.mealName
                                            ?.toLowerCase()
                                            .includes("rajma")
                                        ? "580 kcal"
                                        : item.mealName
                                              ?.toLowerCase()
                                              .includes("chole")
                                          ? "720 kcal"
                                          : item.mealName
                                                ?.toLowerCase()
                                                .includes("biryani")
                                            ? "600 kcal"
                                            : item.mealName
                                                  ?.toLowerCase()
                                                  .includes("paneer")
                                              ? "550 kcal"
                                              : item.mealName
                                                    ?.toLowerCase()
                                                    .includes("roti")
                                                ? "480 kcal"
                                                : item.mealName
                                                      ?.toLowerCase()
                                                      .includes("soup") ||
                                                    item.mealName
                                                      ?.toLowerCase()
                                                      .includes("salad")
                                                  ? "280 kcal"
                                                  : "320 kcal"}
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <p style={{ color: "rgba(255,255,255,0.4)" }}>
                No items available for {activeTab} yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MenuPreview;
