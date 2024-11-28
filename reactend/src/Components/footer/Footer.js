import React, { useEffect, useState } from 'react';
import './footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// const footerImageStyle = {
//   backgroundImage: `url(${process.env.PUBLIC_URL}/images/shape1.svg)`,
//   backgroundRepeat: 'no-repeat',
//   backgroundSize: 'contain',
//   backgroundPosition: 'center',
//   opacity: 0.1,
// };


const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.pageYOffset > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer" >
      <div className="footer-container">
        <div className="cell">
          <img className="logo_image" id="footer-light-logo" src={`${process.env.PUBLIC_URL}/images/light-logoDeeDev.svg`} alt="light logo" />
          <img className="logo_image" id="footer-dark-logo" src={`${process.env.PUBLIC_URL}/images/logoDeeDev.svg`} alt="dark logo" style={{ display: 'none' }} />
          <h4>
            Dee Dhillon <br />
            Freelance Software Developer & Consultant
          </h4>
          <div class="social-icons">
            <a href="https://www.linkedin.com/in/dee-dhillon-15b8b3259/" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={['fab', 'linkedin']} />
            </a>
            <a href="https://github.com/deep-dot" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={['fab', 'github']} />
            </a>
            <a href="#contactSection">
              <FontAwesomeIcon icon={['fas', 'envelope']} />
            </a>
          </div>
        </div>
        <div className="cell">
          <h3>Website Links</h3>
          <a href="/quote">Quote</a>
          <a href="/process">Process</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/faq">FAQs</a>
        </div>
        <div class="cell">
          <h3>Services</h3>
          <p>
            Mobile app development for IOS and Android
          </p>
          <p>
            Website design and development
          </p>
          <p>
            Logo design
          </p>
          <p>
            Future maintenance
          </p>
        </div>
        <div class="cell">
          <h3>Hire Me</h3>
          <a href="/hireme">
            <i class="fa fa-envelope"></i> Drop A Thought
          </a>
        </div>
      </div>
      <p style={{ font: "12px" }}>All rights reserved &copy; 2024-2025</p>
      <button
        className={`back-to-top ${isVisible ? 'visible' : ''}`}
        onClick={scrollToTop}
      > <FontAwesomeIcon icon={['faArrowUp']} />
      </button>
    </footer>
  );
};

export default Footer;

