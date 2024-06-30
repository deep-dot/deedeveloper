
import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faClone, faComment, faPhone, faCaretDown, faSignInAlt, faUserPlus, faSignOutAlt, faHamburger } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Header = ({ loggedIn }) => {
  const blogRef = useRef(null);
  const blogMenuRef = useRef(null);
  const headerRef = useRef(null);
  const hamBurgerMenu = useRef(null);
  const [lastScroll, setLastScroll] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userImage, setUserImage] = useState(null); 

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { data } = await axios.get('/api/auth/status');
        console.log('data in header==',data.isAuthenticated)
        setIsAuthenticated(data.isAuthenticated);
        setUserImage(data.userImage);
      } catch (error) {
        console.error('Failed to fetch auth status', error);
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    // Blog menu button
    const handleBlogClick = () => {
      blogRef.current.classList.toggle('active');
      if (blogRef.current.classList.contains('active')) {
        blogMenuRef.current.style.display = 'block';
      } else {
        blogMenuRef.current.style.display = 'none';
      }
    };

    const mainWrapper = document.querySelector('.main-wrapper');

    const hamBurgerMenuClick = () => {
     // console.log('hamburgermenu clicked==', mainWrapper)
      mainWrapper.classList.toggle("active");
    }

    blogRef.current.addEventListener('click', handleBlogClick);
    hamBurgerMenu.current.addEventListener('click', hamBurgerMenuClick)

    // Hide navbar while scrolling down
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll < lastScroll) {
        headerRef.current.classList.remove('hidden');
      } else {
        headerRef.current.classList.add('hidden');
      }
      setLastScroll(currentScroll);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      blogRef.current.removeEventListener('click', handleBlogClick);
      window.removeEventListener('scroll', handleScroll);
      hamBurgerMenu.current.removeEventListener('click', hamBurgerMenuClick)
    };
  }, [lastScroll]);

  return (
    // Add ref={headerRef} to the header element
    <header ref={headerRef}>
      <nav className="nav">
        <img href="#" src={`${process.env.PUBLIC_URL}/images/logoDeeDev.svg`} alt="Logo" />
        <ul className="nav_list">
          <li>
            <a href="/">
              <FontAwesomeIcon icon={faHome} className="icon-margin-right" />Home
            </a>
          </li>
          <li>
            <a href="/#aboutSection">
              <FontAwesomeIcon icon={faUser} className="icon-margin-right" />About
            </a>
          </li>
          <li>
            <a href="/#servicesSection">
              <FontAwesomeIcon icon={faClone} className="icon-margin-right" />Services
            </a>
          </li>
          <li>
            <a href="/#testimonial">
              <FontAwesomeIcon icon={faComment} className="icon-margin-right" />Testimonial
            </a>
          </li>
          <li>
            <a href="/#contactSection">
              <FontAwesomeIcon icon={faPhone} className="icon-margin-right" />Contact
            </a>
          </li>
          <li ref={blogRef} className="blog">
            <a href="#">
              <FontAwesomeIcon icon={faCaretDown} className="icon-margin-right" />
              Blog
            </a>
            <ul ref={blogMenuRef} className="blog-menu">
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
              <li id="loggedIn">
                <a href="/auth/login">
                  <FontAwesomeIcon icon={faSignInAlt} className="icon-margin-right" />Sign In
                </a>
              </li>
              <li id="reg">
                <a href="/auth/newuser">
                  <FontAwesomeIcon icon={faUserPlus} className="icon-margin-right" />Sign Up
                </a>
              </li>
            </>
          ) : (
            <>
              <li id="loggedOut">
                <a href="/auth/logout">
                  <FontAwesomeIcon icon={faSignOutAlt} className="icon-margin-right" />Sign Out
                </a>
              </li>
              <li>
                <a href="/auth/profile">
                  <img
                    href="#"
                    src={userImage}
                    alt=""
                    style={{ width: '40px', borderRadius: '100%' }}
                  />
                </a>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div ref={hamBurgerMenu} className="hamburger-menu">
        <div className="bar"></div>
      </div>
    </header>
  );
};

export default Header;

