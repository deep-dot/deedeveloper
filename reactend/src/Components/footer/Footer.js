import React, { useEffect, useState } from 'react';
import './footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

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
          <div>
            <a href="https://www.facebook.com/">
              <FontAwesomeIcon icon={['fab', 'facebook']} />
            </a>
            <a href="https://www.linkedin.com/">
              <FontAwesomeIcon icon={['fab', 'linkedin']} />
            </a>
            <a href="https://www.instagram.com/">
              <FontAwesomeIcon icon={['fab', 'instagram']} />
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
          <a href="#">
            Mobile app development for IOS and Android
          </a>
          <a href="#">
            Website design and development
          </a>
          <a href="">
            Logo design
          </a>
          <a>
            Future maintenance
          </a>
        </div>
        <div class="cell">
          <h3>Hire Me</h3>
          <a href="/#contactSection">
            <i class="fa fa-envelope"></i> Drop A Thought
          </a>
        </div>
      </div>
      <p style={{ font: "12px" }}>All rights reserved &copy; 2024</p>
      <button
        className={`back-to-top ${isVisible ? 'visible' : ''}`}
        onClick={scrollToTop}
      > <FontAwesomeIcon icon={faArrowUp} />
      </button>
    </footer>
  );
};

export default Footer;

