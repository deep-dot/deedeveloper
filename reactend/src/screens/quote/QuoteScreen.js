import React, { useState } from "react";
import SignUp from "../../Components/quote/SignUp";
import QuoteForm from "../../Components/quote/QuoteForm";
import './quoteScreen.css';

const Quote = () => {
    const [page, setPage] = useState(0);
    const [quoteFormData, setQuoteFormData] = useState({});
    const [formCompleted, setFormCompleted] = useState(false);

    const FormTitles = ["What should your website include?", "Please send your detail so i can get back to you asap 😀"];

    const PageDisplay = () => {
        if (page === 0) {
            return <QuoteForm quoteFormData={quoteFormData} setQuoteFormData={setQuoteFormData} setFormCompleted={setFormCompleted} />;
        } else {
            return <SignUp quoteFormData={quoteFormData} />;
        }
    };

    return (
        <>
            <section className="quoteSection">
                <h1>Understand the Costs of Building your New Website</h1>
                <p>Our ‘Website Costing Tool’ is designed to assist you in understanding the costs involved in the design and development of your new website.
                    Simply fill in your website requirements below and click submit, the whole processes should take no more than 2 minutes for you to complete and don’t worry if you’re not sure of an answer, just select “unsure” and we will work it out with you.
                </p>
                <div className="quote-form-container">
                    <h1>{FormTitles[page]}</h1>
                    {PageDisplay()}
                    {page > 0 && (
                        <button
                            id="previous-button"
                            className="previous-button"
                            onClick={() => { setPage(page - 1) }}
                        >
                            Previous
                        </button>
                    )}
                    {page < FormTitles.length - 1 && (
                        <button
                            id="next-button"
                            className="next-button"
                            // disabled={!formCompleted}
                            disabled={false}
                            style={{ opacity: formCompleted ? 1 : 0.3 }}
                            onClick={() => { setPage(page + 1) }}
                        >
                            Next
                        </button>
                    )}
                </div>
            </section>
        </>
    );
}

export default Quote;