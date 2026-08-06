import { Link } from "react-router-dom";
import { useState } from "react";
import API from "../api/api";
function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    budget: "",
    service: "",
    message: "",
  });
  const [submissionState, setSubmissionState] = useState({ type: "", message: "" });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionState({ type: "", message: "" });

    try {
      const res = await API.post("/leads", formData);

      setSubmissionState({ type: "success", message: res.data.message });

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        budget: "",
        service: "",
        message: "",
      });
    } catch (error) {
      setSubmissionState({
        type: "error",
        message: error.response?.data?.message || "We could not submit your request. Please try again.",
      });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* ================= NAVBAR ================= */}

      <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">
          <h1 className="text-3xl font-extrabold">
            <span className="text-blue-700">LeadDesk</span>{" "}
            <span className="text-slate-800">Pro</span>
          </h1>

          <div className="hidden md:flex gap-8 font-medium">
            <a href="#" className="hover:text-blue-600">
              Home
            </a>
            <a href="#" className="hover:text-blue-600">
              Features
            </a>
            <a href="#" className="hover:text-blue-600">
              Pricing
            </a>
            <a href="#" className="hover:text-blue-600">
              Contact
            </a>
          </div>

          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Admin Login
          </Link>
        </div>
      </nav>

      {/* ================= HERO ================= */}

      <section className="pt-36 pb-24 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center px-8">
          {/* Left */}

          <div className="text-white">
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
              #1 Lead Management Platform
            </span>

            <h1 className="text-6xl font-extrabold mt-8 leading-tight">
              Manage Leads.
              <br />
              Close More Deals.
            </h1>

            <p className="mt-8 text-blue-100 text-xl leading-8">
              Capture, organize and manage customer inquiries in one place.
              Increase sales productivity with a modern lead management system.
            </p>

            <div className="flex gap-5 mt-10">
              <button className="bg-white text-blue-700 px-8 py-4 rounded-xl font-bold hover:scale-105 transition">
                Get Started
              </button>

              <button className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-700 transition">
                Learn More
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-16">
              <div>
                <h2 className="text-3xl font-bold">10K+</h2>
                <p className="text-blue-100">Leads Managed</p>
              </div>

              <div>
                <h2 className="text-3xl font-bold">500+</h2>
                <p className="text-blue-100">Businesses</p>
              </div>

              <div>
                <h2 className="text-3xl font-bold">99%</h2>
                <p className="text-blue-100">Success Rate</p>
              </div>
            </div>
          </div>

          {/* Right Form */}

          <div className="bg-white rounded-3xl shadow-2xl p-10">
            <h2 className="text-4xl font-bold text-slate-800">Request Demo</h2>

            <p className="text-gray-500 mt-2 mb-8">
              Fill in your details and we'll contact you shortly.
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                minLength="2"
                className="w-full border border-gray-300 rounded-xl p-4 text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="w-full border border-gray-300 rounded-xl p-4 text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-4"
              />

              <input
                type="text"
                name="service"
                placeholder="Service Required"
                value={formData.service}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-4"
              />

              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company Name"
                className="w-full border border-gray-300 rounded-xl p-4 text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>Select Budget</option>
                <option>₹10,000 - ₹25,000</option>
                <option>₹25,000 - ₹50,000</option>
                <option>₹50,000+</option>
              </select>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                placeholder="Tell us about your project..."
                required
                minLength="10"
                className="w-full border border-gray-300 rounded-xl p-4 text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-bold transition"
              >
                Submit Lead
              </button>

              {submissionState.message && (
                <p
                  role="status"
                  className={`rounded-lg px-4 py-3 text-sm ${
                    submissionState.type === "success"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {submissionState.message}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}

      <section className="max-w-7xl mx-auto py-24 px-8">
        <h2 className="text-5xl font-bold text-center">
          Why Choose LeadDesk Pro?
        </h2>

        <p className="text-center text-gray-500 mt-5 mb-16 text-lg">
          Everything you need to manage and grow your customer relationships.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Lead Tracking",
              desc: "Track leads from inquiry to conversion effortlessly.",
              icon: "📊",
            },
            {
              title: "Real-Time Analytics",
              desc: "Make smarter decisions using live business insights.",
              icon: "📈",
            },
            {
              title: "Team Collaboration",
              desc: "Assign leads and collaborate with your sales team.",
              icon: "🤝",
            },
            {
              title: "Automation",
              desc: "Automate repetitive sales and follow-up tasks.",
              icon: "⚡",
            },
            {
              title: "Cloud Access",
              desc: "Access your CRM securely from anywhere.",
              icon: "☁️",
            },
            {
              title: "24/7 Support",
              desc: "Dedicated support whenever you need assistance.",
              icon: "🎯",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl shadow-lg p-8 hover:-translate-y-2 hover:shadow-2xl transition duration-300"
            >
              <div className="text-5xl">{item.icon}</div>

              <h3 className="text-2xl font-bold mt-6">{item.title}</h3>

              <p className="text-gray-500 mt-4 leading-7">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}

      <section className="bg-blue-700 py-20">
        <div className="max-w-5xl mx-auto text-center text-white px-8">
          <h2 className="text-5xl font-bold">Ready to Grow Your Business?</h2>

          <p className="mt-6 text-xl text-blue-100">
            Join thousands of companies using LeadDesk Pro to manage their
            sales.
          </p>

          <button className="mt-10 bg-white text-blue-700 px-10 py-4 rounded-xl font-bold hover:scale-105 transition">
            Start Free Trial
          </button>
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer className="bg-slate-900 text-center text-white py-10">
        <h2 className="text-3xl font-bold">LeadDesk Pro</h2>

        <p className="mt-3 text-gray-400">Modern Lead Management Platform</p>

        <p className="mt-6 text-gray-500">
          © 2026 LeadDesk Pro. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
