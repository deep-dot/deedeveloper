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
      <section className="footer-container">
        <div className="cell">
          <img className="logo_image" id="footer-light-logo" src={`${process.env.PUBLIC_URL}/images/light-logoDeeDev.svg`} alt="light logo" style={{ display: 'none' }} />
          <img className="logo_image" id="footer-dark-logo" src={`${process.env.PUBLIC_URL}/images/logoDeeDev.svg`} alt="dark logo" />

          <p>
            Dee Dhillon - Freelance Software Developer
          </p>
          <p>
            High Quality is our first priority
          </p>
          <div className="social-icons">
            <div>
              <a href="https://www.facebook.com/">
                <FontAwesomeIcon icon={['fab', 'facebook']} />
              </a>
            </div>
            <div>
              <a href="https://www.linkedin.com/">
                <FontAwesomeIcon icon={['fab', 'linkedin']} />
              </a>
            </div>
            <div>
              <a href="https://www.instagram.com/">
                <FontAwesomeIcon icon={['fab', 'instagram']} />
              </a>
            </div>
          </div>
        </div>
        <div className="cell">
          <div className="webLinks">
            <div className="webMain">Website Links</div>
            <a href="/quote">Quote</a>
            <a href="/process">Process</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/faq">FAQs</a>
          </div>
        </div>
        <div className="cell">
          <div className="servicesLinks">
            <div className="serviceMain">Services</div>
            <div>Mobile app development for IOS and Android</div>
            <div>Website design and development</div>
            {/* <div>Search Engine Optimisation</div>
            <div>Google Ads Management</div> */}
            <div>Logo design</div>
            <div>Future maintenance</div>
          </div>
        </div>
        <div className="cell">
          <div className="contactLinks">
            <div className="contactMain">Contact</div>
            <div>
              <FontAwesomeIcon icon="envelope" /> info@deedeveloper.com
            </div>
            <div>
              <FontAwesomeIcon icon="phone" /> +61432000123
            </div>
          </div>
        </div>
      </section>
      <p className="copyrights">Copyrights 2024 &copy; deedeveloper.com</p>
      <button
        className={`back-to-top ${isVisible ? 'visible' : ''}`}
        onClick={scrollToTop}
      > <FontAwesomeIcon icon={faArrowUp} />
      </button>
    </footer>
  );
};

export default Footer;

