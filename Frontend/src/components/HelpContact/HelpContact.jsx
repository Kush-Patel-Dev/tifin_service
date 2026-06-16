import { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";
import ScrollReveal from "../ScrollReveal/ScrollReveal";
import emailjs from "@emailjs/browser";
import "./HelpContact.css";

const faqs = [
  {
    q: "How does the subscription work?",
    a: "Choose a plan (daily, weekly, or monthly), customize your meal preferences, and we deliver fresh meals to your doorstep at your chosen time. You can pause, modify, or cancel anytime.",
  },
  {
    q: "Can I change my meal preferences?",
    a: "Absolutely! You can update your meal preferences, dietary requirements, and delivery schedule anytime through your account dashboard or by contacting our support team.",
  },
  {
    q: "What areas do you deliver to?",
    a: "We currently serve Ahmedabad, Surat, and Rajkot. We are expanding to more cities soon. Enter your PIN code to check delivery availability.",
  },
  {
    q: "How do I cancel or pause my subscription?",
    a: "You can pause or cancel your subscription anytime from your account settings. There are no cancellation fees or long-term commitments. Pauses can be scheduled in advance.",
  },
  {
    q: "Is the food safe and hygienic?",
    a: "Yes! We follow strict food safety standards. Our kitchen is FSSAI certified, and all meals are prepared in a temperature-controlled environment with fresh ingredients sourced daily.",
  },
];

const HelpContact = () => {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState(0);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    // Auto-fill user email/name if logged in
    if (user) {
      if (user.email) setEmail(user.email);
      if (user.displayName) setName(user.displayName);
    }
  }, [user]);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? -1 : index);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: "", text: "" });

    if (!user) {
      setStatusMessage({
        type: "error",
        text: "Please sign in to send a message.",
      });
      return;
    }

    if (!name || !email || !subject || !message) {
      setStatusMessage({ type: "error", text: "Please fill in all fields." });
      return;
    }

    setIsSubmitting(true);

    // EmailJS config via Vite env vars
    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    try {
      const contactData = {
        name,
        email,
        subject,
        message,
        createdAt: serverTimestamp(),
      };

      // Save to users/{uid}/contact_us collection (preserve existing Firestore structure)
      const contactRef = collection(db, "users", user.uid, "contact_us");
      await addDoc(contactRef, contactData);

      // Prepare template params for EmailJS (template expects `name`, `email`, `subject`, `message`)
      const templateParams = {
        name,
        email,
        subject,
        message,
      };

      // Send confirmation email if EmailJS is configured
      console.log(
        "EmailJS config: SERVICE_ID=",
        !!SERVICE_ID,
        "TEMPLATE_ID=",
        !!TEMPLATE_ID,
        "PUBLIC_KEY=",
        !!PUBLIC_KEY,
      );
      if (SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY) {
        try {
          // Ensure EmailJS is initialized (some versions require init)
          if (typeof emailjs.init === "function") {
            try {
              emailjs.init(PUBLIC_KEY);
            } catch (initErr) {
              console.warn("EmailJS init warning:", initErr);
            }
          }

          const res = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            templateParams,
            PUBLIC_KEY,
          );
          console.log("EmailJS send success:", res);
        } catch (emailErr) {
          console.error("EmailJS send error:", emailErr);
          // Email failed but data saved — inform the user
          setStatusMessage({
            type: "error",
            text: "Message saved but confirmation email failed to send.",
          });
          setIsSubmitting(false);
          return;
        }
      } else {
        console.warn(
          "EmailJS not configured. Set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY in Frontend/.env and restart dev server.",
        );
        console.log({ SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY });
      }

      setStatusMessage({
        type: "success",
        text: "Message sent successfully. We will contact you soon.",
      });
      // Clear the form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      setStatusMessage({
        type: "error",
        text: "Failed to send message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
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
              Have questions? Find answers below or reach out to our friendly
              support team.
            </p>
          </ScrollReveal>
        </div>

        <div className="help-layout">
          <ScrollReveal>
            <div className="faq-container">
              <h3>Frequently Asked Questions</h3>
              {faqs.map((faq, i) => (
                <div
                  className={`faq-item${openFaq === i ? " open" : ""}`}
                  key={i}
                >
                  <button className="faq-question" onClick={() => toggleFaq(i)}>
                    {faq.q}
                    <span className="faq-icon">+</span>
                  </button>
                  {openFaq === i && <div className="faq-answer">{faq.a}</div>}
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="contact-container">
              <h3>Get in Touch</h3>
              <form className="contact-form" onSubmit={handleSubmit}>
                {statusMessage.text && (
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      marginBottom: "16px",
                      textAlign: "center",
                      color:
                        statusMessage.type === "error" ? "#ff6b6b" : "#4ade80",
                      background:
                        statusMessage.type === "error"
                          ? "rgba(255, 107, 107, 0.1)"
                          : "rgba(74, 222, 128, 0.1)",
                      border: `1px solid ${statusMessage.type === "error" ? "rgba(255, 107, 107, 0.3)" : "rgba(74, 222, 128, 0.3)"}`,
                    }}
                  >
                    {statusMessage.text}
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="How can we help?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea
                    className="form-input"
                    rows="4"
                    placeholder="Tell us more about your query..."
                    style={{ resize: "vertical", minHeight: "100px" }}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="btn-contact-submit"
                  disabled={isSubmitting || !user}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>

                {!user && (
                  <p
                    style={{
                      textAlign: "center",
                      marginTop: "10px",
                      fontSize: "0.85rem",
                      color: "#ff6b6b",
                    }}
                  >
                    Please sign in to contact us.
                  </p>
                )}
              </form>

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
