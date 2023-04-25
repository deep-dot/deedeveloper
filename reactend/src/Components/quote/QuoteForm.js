import React, { useEffect, useState } from "react";
import Select from "react-select";

const questionOptions = [{
  id: 0, question: "Do you currently have a website or require an upgrade?", options: [{ value: "Want new website", label: "Want new website" }, { value: "Want upgrade existing one", label: "Want upgrade existing one" },],
},
{
  id: 1,
  question: "How many pages do you require for your website?",
  options: [
    { value: "1-5", label: "1-5" },
    { value: "6-10", label: "6-10" },
    { value: "11-15", label: "11-15" },
    { value: "16+", label: "16 or more" },
  ],
},
{
  id: 2,
  question: "Would you like a gallery or pictures page on your website?",
  options: [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
    { value: "Not sure", label: "Not sure" },
  ],
},
{
  id: 3,
  question: "Would you like contact or quote forms on your website?",
  options: [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
    { value: "Not sure", label: "Not sure" },
  ],
},
{
  id: 4,
  question: "Do you want customers to find your business via a Google Map?",
  options: [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
    { value: "Not sure", label: "Not sure" },
  ],
},
{
  id: 5,
  question: "Do you have any specific design or branding requirements for your website?",
  options: [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
    { value: "Not sure", label: "Not sure" },
  ],
},
{
  id: 6,
  question: "Do you have images and content ready for your website?",
  options: [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
    { value: "Not sure", label: "Not sure" },
  ],
},
{
  id: 7,
  question: "What is the primary purpose of your website? (e.g. sell products, provide information, build brand awareness)",
  options: [
    { value: "sell-products", label: "Sell products" },
    { value: "provide-information", label: "Provide information" },
    { value: "build-brand-awareness", label: "Build brand awareness" },
    { value: "other", label: "Other" },
  ],
},
{
  id: 8,
  question: "Who is your target audience for the website? (e.g. age range, gender, interests)",
  options: [
    { value: "youth", label: "Youth" },
    { value: "adults", label: "Adults" },
    { value: "seniors", label: "Seniors" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ],
},
{
  id: 9,
  question: "Do you require any special features on your website? (e.g. e-commerce functionality, blog, social media integration)",
  options: [
    { value: "ecommerce", label: "E-commerce functionality" },
    { value: "blog", label: "Blog" },
    { value: "social-media-integration", label: "Social media integration" },
    { value: "other", label: "Other" },
  ],
},
{
  id: 10,
  question: "What is your budget for the website project?",
  options: [
    { value: "less-than-1000", label: "Less than $1000" },
    { value: "1000-to-5000", label: "$1000 to $5000" },
    { value: "5000-or-more", label: "$5000 or more" },
  ],
},
{
  id: 11,
  question: "What is your timeline for completing the website project?",
  options: [
    { value: "1-month", label: "1 month" },
    { value: "3-months", label: "3 months" },
    { value: "6-months", label: "6 months" },
    { value: "other", label: "Other" },
  ],
},
];



const CustomSelect = ({ question, options, value, onChange }) => (
  <div className="question-container">
    <label className="question-label">{question}</label>
    <Select
      options={options}
      value={options.find((option) => option.value === value)}
      onChange={onChange}
      className="question-select"
    />
  </div>
);

const QuoteForm = ({ quoteFormData, setQuoteFormData, setFormCompleted }) => {
  const [completedQuestions, setCompletedQuestions] = useState([]);

  useEffect(() => {
    const completedQuestionsIds = Object.keys(quoteFormData);
    setCompletedQuestions(completedQuestionsIds);
    setFormCompleted(completedQuestionsIds.length === questionOptions.length);
  }, [quoteFormData, setFormCompleted]);

  const handleSelectChange = (questionId, questionText, choice) => {
    setQuoteFormData({
      ...quoteFormData,
      [questionId]: {
        question: questionText,
        answer: choice.value,
      },
    });
  };

  return (
    <div className="form-container">
      {questionOptions.map((questionData) => (
        <CustomSelect
          key={questionData.id}
          question={questionData.question}
          options={questionData.options}
          value={questionData[questionData.id]}
          onChange={(choice) => handleSelectChange(questionData.id, questionData.question, choice)}
        />
      ))}
    </div>
  );
};

export default QuoteForm;
