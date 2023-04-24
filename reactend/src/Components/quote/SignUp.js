import React, { useState } from "react";

function SignUp({ quoteFormData }) {

  const [inputVerificationCode, setInputVerificationCode] = useState('');
  const [showVerificationCodeInput, setShowVerificationCodeInput] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const { name, email, message, inputVerificationCode } = event.target.elements;

    const quoteFormDataString = Object.values(quoteFormData)
      .map(({ question, answer }) => `${question}: ${answer}`)
      .join('\n');

    const fullMessage = `${message.value}\n\n Hi, \n i am ${name.value} and this is my email address ${email.value} \n Quote Form Data:\n ${quoteFormDataString}`;

    try {
      const response = await fetch('/verifyUserEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.value, email: email.value, formId: 'contact-form-reactend' }),
      });

      const data = await response.json();
      console.log('verify code react end ===', data.verificationCode);

      if (inputVerificationCode == data.verificationCode) {
        console.log('matched');

        const emailResponse = await fetch('/UserEmail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.value, email: email.value, message: fullMessage }),
        });

        const emailData = await emailResponse.json();
        if (emailData.success) {
          alert('Email sent successfully');
          setLoading(false);
          event.target.reset();
        } else {
          alert('Email sending failed');
          setLoading(false);
        }
      } else {
        alert('Incorrect verification code. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.log('Verification code sending failed', error);
      setLoading(false);
    }
  };
  return (
     <div className="form-container"> 
      <form onSubmit={handleSubmit}>
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
          required
          placeholder="Verification Code"
          style={{ display: showVerificationCodeInput ? "block" : "none" }}
          onChange={(e) => {
            setInputVerificationCode (e.target.value);
          }}
        />
        <button id="submit-button" type="submit"> 
          {loading ? 'Sending...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default SignUp;
