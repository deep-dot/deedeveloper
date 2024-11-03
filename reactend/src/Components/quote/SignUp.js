import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SignUp({ quoteFormData }) {
  const [inputVerificationCode, setInputVerificationCode] = useState('');
  const [showVerificationCodeInput, setShowVerificationCodeInput] = useState(false);
  const [showVerificationCodeSubmitBtn, setShowVerificationCodeSubmitBtn] = useState(false);
  const [verify, setVerify] = useState(true);
  const [userMsg, setUserMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  let emailToDev, verifyEmail;

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await axios.get('/api/auth/userDetail');
        // console.log('data in header==', data.userEmail)
        if (data.userName && data.userEmail) {
          setUserName(data.userName);
          setUserEmail(data.userEmail);
          setFormData({
            ...formData,
            name: data.userName,
            email: data.userEmail,
          });
        }
      } catch (error) {
        console.error('Failed to fetch auth status', error);
      }
    };

    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  verifyEmail = async (event) => {
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
        setErrorMsg('');
        setShowVerificationCodeInput(true);
        setShowVerificationCodeSubmitBtn(true);
        setVerify(false);
      } else {
        setErrorMsg('Email sending failed, please try again.');
        setUserMsg('');
        setShowVerificationCodeInput(false);
        setShowVerificationCodeSubmitBtn(false);
        setVerify(true);
      }
    } catch (error) {
      console.error(error);
      setErrorMsg('An error occurred. Please try again.');
      setUserMsg('');
    } finally {
      setLoading(false);
    }
  };

  emailToDev = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { name, email, message } = formData;
    const quoteFormDataString = Object.values(quoteFormData)
      .map(({ question, answer }) => `${question}: ${answer}`)
      .join('\n');

    const fullMessage = `${message}\n\nHi,\nI am ${name}.\nQuote Form Data:\n${quoteFormDataString}`;

    const senddatatoserver = { name, email, verificationCode: inputVerificationCode, message: fullMessage, formId: 'contact-form-reactend' }
    console.log('senddatatoserver==', senddatatoserver);
    try {
      const response = await fetch('/UserEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(senddatatoserver),
      });
      const data = await response.json();
      //console.log('data.success in sign up==', data.success);
      if (data.success) {
        setUserMsg('Email sent successfully');
        setErrorMsg('');
      } else {
        setErrorMsg('Email sending failed, please try again.');
        setUserMsg('');
      }
      if (data.message === 'Invalid verification code') {
        setErrorMsg('Incorrect verification code.');
        setUserMsg('');
      }
    } catch (error) {
      setErrorMsg('An error occurred while sending the email. Please try again.');
      setUserMsg('');
    } finally {
      setLoading(false);
      setShowVerificationCodeInput(false);
      setShowVerificationCodeSubmitBtn(false);
      setVerify(true);
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (userName && userEmail) {
      setInputVerificationCode(null);
      await emailToDev(event); 
    } else {
      if (verify) {
        await verifyEmail(event);
      } else {
        //console.log('clicked')
        await emailToDev(event);
      }
    }
  };


  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <input id="name" type="text" required placeholder="Name*" value={formData.name} onChange={handleInputChange} readOnly={!!userName} />
        <input id="email" type="text" required placeholder="Email*" value={formData.email} onChange={handleInputChange} readOnly={!!userEmail} />
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

        {verify && (
          <button 
          id="submit-button" 
          type="submit" 
          style={{ display: 'block' }}
          >
            {loading ? 'Sending...' : 'Submit'}
          </button>
        )}
      </form>
    </div>
  );
}

export default SignUp;
