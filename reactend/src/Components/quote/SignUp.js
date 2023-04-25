import React, { useState } from "react";

function SignUp({ quoteFormData }) {

  const [inputVerificationCode, setInputVerificationCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationCodeSubmitBtn, setShowVerificationCodeSubmitBtn] = useState(false);
  const [showVerificationCodeInput, setShowVerificationCodeInput] = useState(false);
  const [showSubmitBtn, setShowSubmitBtn] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const verifyEmail = async (event) => {
    event.preventDefault();
    setLoading(true);

    const { name, email } = event.target.elements;

    if (!verificationCode) {
      try {
        const response = await fetch('/verifyUserEmail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.value, email: email.value, formId: 'contact-form-reactend' }),
        });
        const data = await response.json();
        if (data.success) {
          setVerificationCode(data.verificationCode);
          console.log('verify code react end ===', data.verificationCode);
          alert(`A verification code has been sent to your email: ${email.value}. Please check your email and enter the code.`)
          setShowVerificationCodeInput(true);
          setShowVerificationCodeSubmitBtn(true);
          setShowSubmitBtn(false)
          setLoading(false);
        } else {
          console.log('Verification code sending failed');
          setLoading(false);
          setShowVerificationCodeInput(false);
          setShowVerificationCodeSubmitBtn(false);
          setShowSubmitBtn(true);
        }
      } catch (e) { console.log(e) }
    }
  }

  const emailToDev = async (event) => {
    console.log('inputVerificationCode, verificationCode ==', event.target);
    event.preventDefault();
    setLoading(true);
    const { name, email, message } = formData;

    const quoteFormDataString = Object.values(quoteFormData)
      .map(({ question, answer }) => `${question}: ${answer}`)
      .join('\n');

    const fullMessage = `${message}\n\n Hi, \n i am ${name} and this is my email address ${email} \n Quote Form Data:\n ${quoteFormDataString}`;
    if (inputVerificationCode == verificationCode) {
      console.log('matched');

      const emailResponse = await fetch('/UserEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, msg: fullMessage, formId: 'contact-form-reactend' }),
      });

      const emailData = await emailResponse.json();
      if (emailData.success) {
        alert('Email sent successfully');
        setLoading(false);
        setShowVerificationCodeInput(false);
        setShowVerificationCodeSubmitBtn(false);
        setShowSubmitBtn(true);
      } else {
        alert('Email sending failed, please try again');
        setLoading(false);
        setShowVerificationCodeInput(false);
        setShowVerificationCodeSubmitBtn(false);
        setShowSubmitBtn(true);
      }
    } else {
      alert('Incorrect verification code. Please submit your details again.');
      setLoading(false);
      setShowVerificationCodeInput(false);
      setShowVerificationCodeSubmitBtn(false);
      setShowSubmitBtn(true);
    }
  }

  return (
    <div className="form-container">
      <form onSubmit={verifyEmail}>
        <input
          id="name"
          type="text"
          required
          placeholder="Name*"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
          }}
        />
        <input
          id="email"
          type="text"
          required
          placeholder="Email*"
          value={formData.email}
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value });
          }}
        />
        <textarea
          id='message'
          type="text"
          required
          placeholder="message"
          rows="6"
          value={formData.message}
          onChange={(e) => {
            setFormData({
              ...formData,
              message: e.target.value,
            });
          }}
        />
        <input
          id="verification-code"
          type="text"
          required={showVerificationCodeInput}
          placeholder="Verification Code"
          style={{ display: showVerificationCodeInput ? "block" : "none" }}
          onChange={(e) => {
            setInputVerificationCode(e.target.value);
          }}
        />
        <button
          id="verify-code-button"
          type="button"
          onClick={emailToDev}
          style={{ display: showVerificationCodeSubmitBtn ? "block" : "none" }}
        >
          {loading ? 'Veryfying...' : 'Verify'}
        </button>
        <button
          id="submit-button"
          type="submit"
          style={{ display: showSubmitBtn ? "block" : "none" }}
        >
          {loading ? 'Sending...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default SignUp;
