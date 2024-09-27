import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Log the form data
    console.log('Form submitted with the following data:', formData);
    // Here you would typically send the data to a server
    // For now, we'll just log it and clear the form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    alert('Thank you for your message! It has been logged.');
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Contact Me</h1>
      
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Your Input is Valuable!</h5>
          <p className="card-text">
            As a project aimed at providing unbiased battery information, your feedback and suggestions are incredibly valuable. Whether you have ideas for new features, improvements to existing tools, or just want to share your thoughts on the project, I'd love to hear from you! Your input helps make this resource more useful for the entire battery community. Don't hesitate to reach out with any questions, suggestions, or even if you've spotted an error that needs fixing. Together, we can make this project even better!
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="subject" className="form-label">Subject</label>
          <input
            type="text"
            className="form-control"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="message" className="form-label">Message</label>
          <textarea
            className="form-control"
            id="message"
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Send Message</button>
      </form>
    </div>
  );
}