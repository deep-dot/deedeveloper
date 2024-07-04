

import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Quote from "./screens/quote/QuoteScreen";
import Portfolio from './screens/portfolio/Portfolio';

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/resumeData.json')
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Quote />} />
        {data && <Route path="/portfolio" element={<Portfolio data={data.portfolio} />} />}
      </Routes>
    </Router>
  );
};

export default App;
