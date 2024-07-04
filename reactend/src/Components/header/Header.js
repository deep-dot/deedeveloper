import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Header.css';

const Header = ({ isAuthenticated, user }) => {
  const [isAboutMenuOpen, setAboutMenuOpen] = useState(false);
  const [isBlogMenuOpen, setBlogMenuOpen] = useState(false);
  const [isNavBarActive, setNavBarActive] = useState(false);

  const blogMenuRef = useRef(null);
  const aboutMenuRef = useRef(null);
  const loggedInRef = useRef(null);
  const testimonialRef = useRef(null);

  const toggleAboutMenu = () => {
    setAboutMenuOpen(prevState => !prevState);
  };

  const toggleBlogMenu = () => {
    setBlogMenuOpen(prevState => !prevState);
  };

  const handleHamburgerMenuToggle = () => {
    setNavBarActive(prevState => !prevState);
  };

  useEffect(() => {
    const menuItems = document.querySelectorAll('nav > ul > li > a');
    const currentLocation = window.location.pathname;

    menuItems.forEach((item) => {
      if (item.getAttribute('href') === currentLocation) {
        item.style.color = 'tomato';
      }
    });

    const handleScroll = () => {
      const header = document.querySelector('header');
      const currentScroll = window.pageYOffset;
      if (currentScroll < lastScroll) {
        header.classList.remove('hidden');
      } else {
        header.classList.add('hidden');
      }
      lastScroll = currentScroll;
    };

    let lastScroll = 0;
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isBlogMenuOpen) {
      blogMenuRef.current.style.maxHeight = blogMenuRef.current.scrollHeight + 'px';
      if (window.matchMedia('(max-width: 768px)').matches) {
        loggedInRef.current.style.marginTop = blogMenuRef.current.scrollHeight + 'px';
      }
    } else {
      blogMenuRef.current.style.maxHeight = null;
      loggedInRef.current.style.marginTop = null;
    }
  }, [isBlogMenuOpen]);

  useEffect(() => {
    if (isAboutMenuOpen) {
      aboutMenuRef.current.style.maxHeight = aboutMenuRef.current.scrollHeight + 'px';
      if (window.matchMedia('(max-width: 768px)').matches) {
        testimonialRef.current.style.marginTop = aboutMenuRef.current.scrollHeight + 'px';
      }
    } else {
      aboutMenuRef.current.style.maxHeight = null;
      testimonialRef.current.style.marginTop = null;
    }
  }, [isAboutMenuOpen]);

  return (
    <header>
      <div className={`nav_bar ${isNavBarActive ? 'active' : ''}`}>
        <img className="logo_image" id="light-logo" src={`${process.env.PUBLIC_URL}/images/light-logoDeeDev.svg`} alt="Light Logo" />
        <img className="logo_image" id="dark-logo" src={`${process.env.PUBLIC_URL}/images/logoDeeDev.svg`} alt="Dark Logo" style={{ display: 'none' }} />

        <nav>
          <ul>
            <li>
              <a href="/">
                <i className="fas fa-home"></i>Home
                <FontAwesomeIcon className="fa-icon" icon={['far', 'moon']} />
              </a>
            </li>
            <li className={`navAbout ${isAboutMenuOpen ? 'open' : ''}`} onClick={toggleAboutMenu}>
              <a href="#">
                About
                <span className="toggle-icon">{isAboutMenuOpen ? '-' : '+'}</span>
              </a>
              <ul className="about-menu" ref={aboutMenuRef} style={{ maxHeight: isAboutMenuOpen ? '200px' : '0' }}>
                <li>
                  <a href="/portfolio">Portfolio</a>
                </li>
                <li>
                  <a href="/#servicesSection">Services</a>
                </li>
              </ul>
            </li>
            <li id="Testimonial" ref={testimonialRef}>
              <a href="/#testimonial">
                <i className="fas fa-comment"></i>Testimonial
              </a>
            </li>
            <li>
              <a href="/#contactSection">
                <i className="fas fa-phone"></i>Contact
              </a>
            </li>
            <li className={`blog ${isBlogMenuOpen ? 'open' : ''}`} onClick={toggleBlogMenu}>
              <a href="#">
                Blog
                <span className="toggle-icon">{isBlogMenuOpen ? '-' : '+'}</span>
              </a>
              <ul className="blog-menu" ref={blogMenuRef} style={{ maxHeight: isBlogMenuOpen ? '200px' : '0' }}>
                <li>
                  <a href="/blogs">Home</a>
                </li>
                <li className="write-review">
                  <a href="/posts/new">Write blog</a>
                </li>
              </ul>
            </li>
            {!isAuthenticated ? (
              <>
                <li id="loggedIn" ref={loggedInRef}>
                  <a href="/auth/login">
                    <i className="fas fa-sign-in-alt"></i>Sign In
                  </a>
                </li>
                <li id="reg">
                  <a href="/auth/newuser">
                    <i className="fas fa-user-plus"></i>Sign Up
                  </a>
                </li>
              </>
            ) : (
              <>
                <li id="loggedOut">
                  <a href="/auth/logout">
                    <i className="fas fa-sign-out-alt"></i>Sign Out
                  </a>
                </li>
                <li className="profileImage">
                  <a href="/auth/profile">
                    <img src={user.image} alt="" style={{ width: '40px', borderRadius: '100%' }} />
                  </a>
                </li>
              </>
            )}
          </ul>
        </nav>

        <button className="toggle-btn" onClick={() => window.handleDarkModeToggle()}>
          <FontAwesomeIcon className="fa-icon" icon={'faMoon'} />
          <FontAwesomeIcon className="fa-icon" icon={'faSun'} />
        </button>

        <div className="hamburger-menu" onClick={handleHamburgerMenuToggle}>
          <div className="bar"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
