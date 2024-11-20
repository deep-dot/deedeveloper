
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Quote from "./screens/quote/QuoteScreen";
import Navbar from "./Components/navbar/navbar";
import Footer from "./Components/footer/Footer";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleDarkModeToggle = () => {
    console.log("Dark mode toggle clicked");
    setIsDarkMode((prevMode) => !prevMode);
    // Toggle the dark mode class on the body
    document.body.classList.toggle("dark", !isDarkMode);
  };

  return (
    <div className={`main-wrapper ${isDarkMode ? "dark" : "light"}`}>
      <Navbar isDarkMode={isDarkMode} handleDarkModeToggle={handleDarkModeToggle} />
      <Router>
        <Routes>
          <Route
            path="/quote"
            element={<Quote />}
          />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
};

export default App;
