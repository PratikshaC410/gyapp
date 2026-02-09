import React, { useState } from "react";
import "./contact-us.css";
const API = process.env.REACT_APP_BACKEND_BASEURL;
const Contact = () => {
  const [contact, setContact] = useState({
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setContact({
      ...contact,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/api/auth/contactresponse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Message sent successfully");
        setContact({ email: "", message: "" });
      } else {
        alert(data.message || "Message not sent");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <section className="contact-section">
      <div className="contact-left"></div>

      <div className="contact-right">
        <h1>Contact Us</h1>

        <div className="contact-card">
          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={contact.email}
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              placeholder="Message"
              rows="5"
              value={contact.message}
              onChange={handleChange}
              required
            />

            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
