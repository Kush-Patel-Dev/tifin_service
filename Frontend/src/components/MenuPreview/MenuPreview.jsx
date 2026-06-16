import { useState, useEffect, Fragment } from "react";
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
            const mealData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
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

  const filteredMeals = meals.filter((meal) => meal.menuType === activeTab);

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
              <Fragment key={item.id}>
                <div className="col-lg-3 col-md-6 col-12 mb-4">
                  <ScrollReveal delay={i * 0.08} className="h-100">
                    <div className="menu-item-card h-100">
                      <div className="card-glow"></div>
                      <div className="menu-item-img">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
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
              </Fragment>
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
