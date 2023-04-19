import React from "react";
import Select from "react-select";

const questionOptions = [
  {
    id: 0,
    question: "Do you have an old or outdated website or require an upgrade?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: 1,
    question: "How many pages do you think you require?",
    options: [
      { value: "1-5", label: "1-5" },
      { value: "6-10", label: "6-10" },
      { value: "11-15", label: "11-15" },
      { value: "16+", label: "16+" },
    ],
  },
  {
    id: 2,
    question: "Would you like a Gallery / Pictures page?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: 3,
    question: "Would you like Contact / Quote Forms?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: 4,
    question: "Do you want customers to find your business via a Google Map?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: 5,
    question: "Do you have images for your website?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: 6,
    question: "Do you have content for your website?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
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

const QuoteForm = ({quoteFormData, setQuoteFormData}) => {

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
