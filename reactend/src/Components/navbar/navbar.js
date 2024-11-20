import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faFolder, faPhone, faSignInAlt,
  faSignOutAlt,
  faUserPlus, 
  faUser, 
  faBriefcase,
  faCogs , faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import "./navbar.css";

const Navbar = ({ isDarkMode, handleDarkModeToggle }) => {
  const [isAboutMenuOpen, setAboutMenuOpen] = useState(false);
  const [isNavBarActive, setNavBarActive] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userImage, setUserImage] = useState(null);

  const aboutMenuRef = useRef(null);

  console.log("isDarkMode:", isDarkMode);
console.log("handleDarkModeToggle:", handleDarkModeToggle);

  const toggleAboutMenu = () => {
    setAboutMenuOpen((prevState) => !prevState);
  };

  const handleHamburgerMenuToggle = () => {
    setNavBarActive((prevState) => !prevState);
  };

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/status", {
        method: "GET",
        credentials: "include", // Include cookies for session handling
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
        setUserImage(data.userImage);
      } else {
        console.error("Failed to fetch auth status");
      }
    } catch (error) {
      console.error("Error fetching auth status:", error);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <header>
      <div className={`nav_bar ${isNavBarActive ? "active" : ""}`}>
        <img
          className="logo_image"
          id="light-logo"
          src={`${process.env.PUBLIC_URL}/images/light-logoDeeDev.svg`}
          alt="Light Logo"
          style={{ display: isDarkMode ? "none" : "block" }}
        />
        <img
          className="logo_image"
          id="dark-logo"
          src={`${process.env.PUBLIC_URL}/images/logoDeeDev.svg`}
          alt="Dark Logo"
          style={{ display: isDarkMode ? "block" : "none" }}
        />

        <nav>
          <a href="/"> <FontAwesomeIcon icon={faHome} />  Home </a>
          
          <a href="#" className={`navAbout ${isAboutMenuOpen ? "open" : ""}`} onClick={toggleAboutMenu}>
          <FontAwesomeIcon icon={faFolder} />  Portfolio <span className="toggle-icon">{isAboutMenuOpen ? "-" : "+"}</span>
          </a>
          <li
            className="about-menu"
            ref={aboutMenuRef}
            style={{ maxHeight: isAboutMenuOpen ? "200px" : "0" }}
          >
            <a href="/portfolio"> <FontAwesomeIcon icon={faUser} /> About Me</a>
            <a href="/blogs"> <FontAwesomeIcon icon={faBriefcase} /> My Work</a>
            <a href="/#servicesSection"> <FontAwesomeIcon icon={faCogs} /> Services</a>
          </li>
          <a href="/#contactSection"> <FontAwesomeIcon icon={faPhone} /> Contact</a>

          {!isAuthenticated ? (
            <div className="navRego">
              <a className="#loggedIn" href="/auth/login"> <FontAwesomeIcon icon={faSignInAlt} /> Sign In</a>
              <a className="#reg" href="/auth/newuser"> <FontAwesomeIcon icon={faUserPlus} /> Sign Up</a>
            </div>
          ) : (
            <div className="navRego">
              <a className="#loggedOut" href="/auth/logout"> <FontAwesomeIcon icon={faSignOutAlt} /> Sign Out</a>
              <a className="profileImage" href="/auth/profile">
                <img
                  src={userImage}
                  alt="User Profile"
                  style={{ width: "40px", borderRadius: "100%" }}
                />
              </a>
            </div>
          )}
        </nav>

        <button className="toggle-btn" onClick={handleDarkModeToggle}>
          {isDarkMode ? (
            <FontAwesomeIcon className="fa-icon" icon={faSun} />
          ) : (
            <FontAwesomeIcon className="fa-icon" icon={faMoon} />
          )}
        </button>

        <div className="hamburger-menu" onClick={handleHamburgerMenuToggle}>
          <div className="bar"></div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
