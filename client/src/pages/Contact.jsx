/**
 * Contact Page
 */

import { useState } from "react";
import { HiOutlineMailOpen, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";
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
      // In a real app, you would send this to an API endpoint
      // For now, we'll just show a success message
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-12 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-12">
          Have questions? We'd love to hear from you. Get in touch with our team anytime.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="p-6 rounded-xl bg-gray-50 dark:bg-dark-800 text-center">
            <HiOutlineMailOpen className="w-10 h-10 mx-auto mb-3 text-primary-600" />
            <h3 className="font-semibold mb-2">Email</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <a href="mailto:support@king.com" className="hover:text-primary-600">
                support@king.com
              </a>
            </p>
          </div>

          <div className="p-6 rounded-xl bg-gray-50 dark:bg-dark-800 text-center">
            <HiOutlinePhone className="w-10 h-10 mx-auto mb-3 text-primary-600" />
            <h3 className="font-semibold mb-2">Phone</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <a href="tel:+1234567890" className="hover:text-primary-600">
                +1 (234) 567-890
              </a>
            </p>
          </div>

          <div className="p-6 rounded-xl bg-gray-50 dark:bg-dark-800 text-center">
            <HiOutlineLocationMarker className="w-10 h-10 mx-auto mb-3 text-primary-600" />
            <h3 className="font-semibold mb-2">Location</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              123 Fashion Street<br />
              New York, NY 10001
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8">
          <h2 className="font-semibold text-2xl mb-6">Send us a Message</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Subject *</label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="input-field"
                placeholder="How can we help?"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Message *</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                className="input-field resize-none"
                placeholder="Tell us more..."
                rows="5"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary btn-ripple"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
