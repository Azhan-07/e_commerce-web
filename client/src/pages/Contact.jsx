/**
 * Contact Page
 */

import { useState } from "react";
import { HiOutlineEnvelope, HiOutlinePhone, HiOutlineMapPin } from "react-icons/hi2";
import toast from "react-hot-toast";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const contactCards = [
    { icon: HiOutlineEnvelope, title: "Email", value: "support@king.com", href: "mailto:support@king.com" },
    { icon: HiOutlinePhone, title: "Phone", value: "+1 (234) 567-890", href: "tel:+1234567890" },
    { icon: HiOutlineMapPin, title: "Location", value: "123 Fashion Street\nNew York, NY 10001", href: null },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 to-[#1a1512] dark:from-dark-900 dark:to-dark-950" />
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/[0.03] rounded-full blur-3xl floating-shape" />
        <div className="container-custom relative z-10 text-center">
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-4 page-enter">Contact Us</h1>
          <p className="text-gray-400 max-w-xl mx-auto text-lg leading-relaxed animate-slide-up">
            Have questions? We'd love to hear from you. Get in touch with our team anytime.
          </p>
        </div>
      </div>

      <div className="container-custom py-16">
        {/* Contact cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {contactCards.map((card, i) => (
            <div
              key={card.title}
              className="p-8 rounded-2xl bg-gray-50 dark:bg-dark-800 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 animate-slide-up group"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <card.icon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
              {card.href ? (
                <a href={card.href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {card.value}
                </a>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">{card.value}</p>
              )}
            </div>
          ))}
        </div>

        {/* Contact form */}
        <div className="max-w-2xl mx-auto bg-white dark:bg-dark-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-500 glow-border">
          <h2 className="font-display text-2xl font-bold mb-8 text-center">Send us a Message</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="animate-slide-up" style={{ animationDelay: "50ms" }}>
                <label className="text-sm font-medium mb-2 block">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="input-field input-glow"
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
                <label className="text-sm font-medium mb-2 block">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="input-field input-glow"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: "150ms" }}>
              <label className="text-sm font-medium mb-2 block">Subject *</label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="input-field input-glow"
                placeholder="How can we help?"
                required
              />
            </div>

            <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
              <label className="text-sm font-medium mb-2 block">Message *</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                className="input-field resize-none input-glow"
                placeholder="Tell us more..."
                rows="5"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary btn-ripple w-full md:w-auto"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </span>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
