import React, { useState } from 'react';

function SignUp({ quoteFormData }) {
  const [inputVerificationCode, setInputVerificationCode] = useState('');
  const [showVerificationCodeInput, setShowVerificationCodeInput] = useState(false);
  const [showVerificationCodeSubmitBtn, setShowVerificationCodeSubmitBtn] = useState(false);
  const [showSubmitBtn, setShowSubmitBtn] = useState(true);
  const [userMsg, setUserMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target; // Destructure id and value from event target
    setFormData({
      ...formData,
      [id]: value // Use id to set the corresponding state property
    });
  };

  const verifyEmail = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { name, email } = formData;

    try {
      const response = await fetch('/verifyUserEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, formId: 'contact-form-reactend' }),
      });
      const data = await response.json();
      if (data.success) {
        setInputVerificationCode(data.verificationCode)
        setUserMsg(`A verification code has been sent to your email: ${email}. Please check your email and enter the code.`);
        setShowVerificationCodeInput(true);
        setShowVerificationCodeSubmitBtn(true);
        setShowSubmitBtn(false);
      } else {
        setErrorMsg('Email sending failed, please try again.');
        setShowVerificationCodeInput(false);
        setShowVerificationCodeSubmitBtn(false);
        setShowSubmitBtn(true);
      }
    } catch (error) {
      console.error(error);
      setErrorMsg('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const emailToDev = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    // Destructure formData for easier access
    const { name, email, message } = formData;
  
    // Construct the message string from the quoteFormData
    const quoteFormDataString = Object.values(quoteFormData)
      .map(({ question, answer }) => `${question}: ${answer}`)
      .join('\n');
  
    // Build the full message including quote form data
    const fullMessage = `${message}\n\nHi,\nI am ${name}.\nQuote Form Data:\n${quoteFormDataString}`;
  
    // Check if the verification code matches
    // if (inputVerificationCode === verificationCode) {
      const senddatatoserver = { name, email, verificationCode: inputVerificationCode, message: fullMessage, formId: 'contact-form-reactend' }
      try {
        const response = await fetch('/UserEmail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(senddatatoserver),
        });
        const data = await response.json();
  
        if (data.success) {
          // Display success message and reset form as necessary
          setUserMsg('Email sent successfully.');
        } else {
          // Display failure message without resetting form
          setErrorMsg('Email sending failed, please try again.');
        }
        if (data.message === 'Invalid verification code') { 
          // Handle incorrect verification code
          setErrorMsg('Incorrect verification code.');
        }
      } catch (error) {
        setErrorMsg('An error occurred while sending the email. Please try again.');
      } finally {
        setLoading(false);
        setShowVerificationCodeInput(false);
        setShowVerificationCodeSubmitBtn(false);
        setShowSubmitBtn(true);
      }
  };
  

  return (
    <div className="form-container">
      <form onSubmit={showSubmitBtn ? verifyEmail : emailToDev}>
        <input id="name" type="text" required placeholder="Name*" value={formData.name} onChange={handleInputChange} />
        <input id="email" type="text" required placeholder="Email*" value={formData.email} onChange={handleInputChange} />
        <textarea id="message" required placeholder="Message" rows="6" value={formData.message} onChange={handleInputChange} />

        {showVerificationCodeInput && (
          <input
            id="verification-code"
            type="text"
            required
            placeholder="Verification Code"
            onChange={(e) => setInputVerificationCode(e.target.value)}
          />
        )}

        {userMsg && <div id="msg" style={{ display: 'block', color: "green" }}>{userMsg}</div>}
        {errorMsg && <div id="err" style={{ display: 'block', color: "tomato" }}>{errorMsg}</div>}

        {showVerificationCodeSubmitBtn && (
          <button id="verify-code-button" type="button" onClick={emailToDev} style={{ display: 'block' }}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        )}

        {showSubmitBtn && (
          <button id="submit-button" type="submit" style={{ display: 'block' }}>
            {loading ? 'Sending...' : 'Submit'}
          </button>
        )}
      </form>
    </div>
  );
}

export default SignUp;
