import React, { useState } from "react";

function SignUp({ quoteFormData }) {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   console.log(quoteFormData);
  // }, [quoteFormData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const { name, email, message } = event.target.elements;

    // Format quoteFormData as a string
    const quoteFormDataString = Object.values(quoteFormData)
      .map(({ question, answer }) => `${question}: ${answer}`)
      .join('\n');

    // Append quoteFormDataString to the message
    const fullMessage = `${message.value}\n\n Hi, \n i am ${name.value} and this is my email address ${email.value} \n Quote Form Data:\n ${quoteFormDataString}`;

    console.log('full message in sign up info===', fullMessage);
    const verificationCode = Math.floor(Math.random() * 900000) + 100000;
    console.log('contact me form====', email.value, name.value);

    try {
      const response = await fetch('/verifyUserEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.value, email: email.value, verificationCode }),
      });

      const data = await response.json();
      console.log('front verify in contactMe ===', data.success);

      const inputVerificationCode = prompt(`Please enter the verification code that was sent to your email: ${email.value}`);
      if (inputVerificationCode == verificationCode) {
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
        <button id="submit-button" type="submit"> 
          {loading ? 'Sending...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default SignUp;
