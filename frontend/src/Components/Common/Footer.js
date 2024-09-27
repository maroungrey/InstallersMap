import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light mt-5">
      <div className="container py-5">
        <div className="row">
          <div className="col-md-6">
            <h5>About This Project</h5>
            <p>This is a community-supported project aimed at providing clear, unbiased information about batteries. It's a personal learning journey and a resource for the battery community.</p>
            <a href="/project-story" className="text-light">Project Story</a>
          </div>
          <div className="col-md-3">
            <h5>Site Map</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light">Home</a></li>
              <li><a href="/battery-comparison" className="text-light">Battery Comparison Tool</a></li>
              <li><a href="/installers-map" className="text-light">Installer Map</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>Get in Touch</h5>
            <p>Have questions or suggestions? I'd love to hear from you!</p>
            <a href="/contact" className="text-light">Contact</a>
            <div className="mt-3">
              <a href="#" className="text-light me-3" title="Facebook Page Coming Soon">
                <i className="fab fa-facebook fa-lg"></i> <small>(Coming Soon)</small>
              </a>
              <a href="https://github.com/YourGitHubUsername" className="text-light" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github fa-lg"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-secondary py-3">
        <div className="container">
          <div className="row">
            <div className="col text-center">
              <p className="mb-0">&copy; {currentYear} Battery Comparison Project.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;