import React, { useState } from "react";
import SignUp from "../../Components/quote/SignUp";
import QuoteForm from "../../Components/quote/QuoteForm";
import Header from "../../Components/header/Header";
import './quoteScreen.css';
import Footer from '../../Components/footer/Footer';

function Quote() {
    const [page, setPage] = useState(0);
    const [quoteFormData, setQuoteFormData] = useState({});

    const FormTitles = ["What should your website include?", "Please send your detail so i can get back to you asap 😀"];

    const PageDisplay = () => {
        if (page === 0) {
          return <QuoteForm quoteFormData={quoteFormData} setQuoteFormData={setQuoteFormData} />;
        } else {
          return <SignUp quoteFormData={quoteFormData} />;
        }
      };
      

    const nextPage = () => {
        if (page < FormTitles.length - 1) {
            setPage(page + 1);
        }
    };

    const previousPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    return (
        <>
            <div className="container">
                <Header />
                <section>
                    <h1 style={{ color: '#11ABB0' }}>Understand the Costs of Building your New Website</h1>
                    <p>Our ‘Website Costing Tool’ is designed to assist you in understanding the costs involved in the design and development of your new website.
                        Simply fill in your website requirements below and click submit, the whole processes should take no more than 2 minutes for you to complete and don’t worry if you’re not sure of an answer, just select “unsure” and we will work it out with you.
                        If you wish to discuss your new website personally, please call us on 0410000001 24/7 service.</p>
                    <div className="form-container">
                        <h1>{FormTitles[page]}</h1>
                        <div className="body">{PageDisplay()}</div>
                        {page > 0 && (
                            <button className="previous-button" onClick={previousPage}>
                                Previous
                            </button>
                        )}
                        {page < FormTitles.length - 1 && (
                            <button className="next-button" onClick={nextPage}>
                                Next
                            </button>
                        )}
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}

export default Quote;