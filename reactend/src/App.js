

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Quote from "./screens/quote/QuoteScreen";

const App = () => {
  return (
    <Router>
      <Routes>        
          <Route path="/quote" element={<Quote />} />        
      </Routes>
    </Router>
  );
};

export default App;
