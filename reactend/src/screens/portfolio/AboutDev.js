import React, { useEffect, useState } from "react";

import Header from "../../Components/header";
import Footer from "../../Components/aboutDev/Footer";
import About from "../../Components/aboutDev/About";
import Resume from "../../Components/aboutDev/Resume";
import Contact from "../../Components/aboutDev/Contact";
import Testimonials from "../../Components/aboutDev/Testimonials";
import Portfolio from "../../Components/aboutDev/Portfolio";

export default function AboutDev({history}) {
    const [resumeData, setResumeData] = useState({});
  //console.log('presssssssed')
  useEffect(() => {
    fetch("/resumeData.json")
      .then((res) => res.json())
      .then((data) => {
        setResumeData(data);
      });
  }, []);
  return (
    <div className="App">
      <Header data={resumeData.main} />
      <About data={resumeData.main} />
      <Resume data={resumeData.resume} />
      <Portfolio data={resumeData.portfolio} />
      <Testimonials data={resumeData.testimonials} />
      <Contact data={resumeData.main} />
      <Footer data={resumeData.main} />
    </div>
  )
}
