import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import './navbar.css';


const Navbar = () => {
  const [isAboutMenuOpen, setAboutMenuOpen] = useState(false);
  // const [isBlogMenuOpen, setBlogMenuOpen] = useState(false);
  const [isNavBarActive, setNavBarActive] = useState(false);

  // const blogMenuRef = useRef(null);
  const aboutMenuRef = useRef(null);
  const loggedInRef = useRef(null);
  // const testimonialRef = useRef(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userImage, setUserImage] = useState(null);

  // Function to check authentication status
  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status', {
        method: 'GET',
        credentials: 'include', // Include cookies if needed for session
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
        setUserImage(data.userImage);
      } else {
        console.error('Failed to fetch auth status');
      }
    } catch (error) {
      console.error('Error fetching auth status:', error);
    }
  };

  const toggleAboutMenu = () => {
    setAboutMenuOpen(prevState => !prevState);
  };

  const handleHamburgerMenuToggle = () => {
    setNavBarActive(prevState => !prevState);
  };

  useEffect(() => {
    checkAuthStatus();
    const menuItems = document.querySelectorAll('nav > a');
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


  return (
    <header>
      <div className={`nav_bar ${isNavBarActive ? 'active' : ''}`}>
        <img className="logo_image" id="light-logo" src={`${process.env.PUBLIC_URL}/images/light-logoDeeDev.svg`} alt="Light Logo" style={{ display: 'none' }} />
        <img className="logo_image" id="dark-logo" src={`${process.env.PUBLIC_URL}/images/logoDeeDev.svg`} alt="Dark Logo" />

        <nav>
          <a href="/">
            <i className="fas fa-home"></i>Home
            <FontAwesomeIcon className="fa-icon" icon={['far', 'moon']} />
          </a>
          <a className={`navAbout ${isAboutMenuOpen ? 'open' : ''}`} onClick={toggleAboutMenu} href='#/'>
            Portfolio
            <span className="toggle-icon">{isAboutMenuOpen ? '-' : '+'}</span>
          </a>
          <li className="about-menu" ref={aboutMenuRef} style={{ maxHeight: isAboutMenuOpen ? '200px' : '0' }}>
            <a href="/portfolio">About Me</a>
            <a href="/blogs">My Work</a>
            <a href="/#servicesSection">Services</a>
          </li>
         
          <a href="/#contactSection">
            <i className="fas fa-phone"></i>Contact
          </a>
         
          {!isAuthenticated ? (
            <>
              <div className="navRego">
                <a id="loggedIn" ref={loggedInRef} href="/auth/login">
                  <i className="fas fa-sign-in-alt"></i>Sign In
                </a>
                <a id="reg" href="/auth/newuser">
                  <i className="fas fa-user-plus"></i>Sign Up
                </a>
              </div>
            </>
          ) : (
            <>
              <div className="navRego">
                <a id="loggedOut" href="/auth/logout">
                  <i className="fas fa-sign-out-alt"></i>Sign Out
                </a>
                <a className="profileImage" href="/auth/profile">
                  <img src={userImage} alt="" style={{ width: '40px', borderRadius: '100%' }} />
                </a>
              </div>
            </>
          )}

        </nav>

        <button className="toggle-btn" onClick={() => window.handleDarkModeToggle()}>
          <FontAwesomeIcon className="fa-icon" icon={faMoon} />
          <FontAwesomeIcon className="fa-icon" icon={faSun} />
        </button>

        <div className="hamburger-menu" onClick={handleHamburgerMenuToggle}>
          <div className="bar"></div>
        </div>
      </div>
    </header >
  );
};

export default Navbar;
