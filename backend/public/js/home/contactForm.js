
async function contactMe() {
  const form = document.getElementById("contact-form-viewhome");
  const submitButton = document.getElementById("submit-button");
  const verificationCodeInput = document.getElementById("verification-code");
  const verificationCodeLabel = document.getElementById("verification-code-label");
  const messageToUser = document.getElementById("message-to-user");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");

  let inputVerificationCode = null,
  isAuthenticated = false,
    userDetails = {};

  async function checkUserStatus() {
    try {
      const authStatusResponse = await fetch('/api/auth/status');
      const authStatusData = await authStatusResponse.json();
      isAuthenticated = authStatusData.isAuthenticated;

      if (isAuthenticated) {
        const userDetailsResponse = await fetch('/api/auth/userDetail');
        userDetails = await userDetailsResponse.json();

        nameInput.value = userDetails.userName;
        emailInput.value = userDetails.userEmail;
        nameInput.setAttribute('readonly', true);
        emailInput.setAttribute('readonly', true);

        verificationCodeInput.style.display = 'none';
        verificationCodeLabel.style.display = 'none';
      }
    } catch (error) {
      console.error('Failed to fetch user status', error.message);
    }
  }

  // Function to request email verification
  async function verifyEmail(name, email, message) {
    console.log('sendEmail', name, email, message);
    const verificationRequestData = { name, email, message, formId: "contact-form-viewhome" };
    try {
      const response = await fetch("/verifyUserEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(verificationRequestData),
      });
      let data = await response.json();
      messageToUser.hidden = false;
      if (data.success) {
        verificationCodeInput.hidden = false;
        verificationCodeInput.focus();
        messageToUser.textContent = `A verification code has been sent to your email: ${email}. Please check your email and enter the code.`;
        messageToUser.style.color = 'green';
        submitButton.innerHTML = 'Verify'
      } else {
        err = 'Email sending failed, please try again.';
        handleError(messageToUser, err);
      }
    } catch (error) {
      err = 'An error occurred. Please try again.';
      handleError(messageToUser, err);
    }
  }

  // Function to send email directly to the developer
  async function emailToDev(name, email, message, inputVerificationCode) {
    console.log('email to dev', name, email, message, inputVerificationCode);
    const senddatatoserver = { name, email, verificationCode: inputVerificationCode, message, formId: "contact-form-viewhome"};
    try {
      const response = await fetch('/UserEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(senddatatoserver),
      });
      let data = await response.json();
      messageToUser.hidden = false;
      if (data.success) {
        verificationCodeInput.hidden = true;
        submitButton.innerHTML = 'Sent' 
        submitButton.disabled = true;       
        messageToUser.textContent = 'Email sent successfully';
        messageToUser.style.color = 'green';
      } else {
        if('Invalid verification code') {
          err = 'Invalid verification code';
          handleError(messageToUser, err);
          return;
        }
        err = 'Email sending failed, please try again.';
        handleError(messageToUser, err);
      }
    } catch (error) {
      err = 'An error occurred while sending the email. Please try again.';
      handleError(messageToUser, err);
    }
  }

  function handleError(messageElement, errorMsg) {
    verificationCodeInput.hidden = true;
    messageElement.textContent = errorMsg;
    messageElement.style.color = 'red';
    submitButton.innerHTML = 'Submit'
  }

  async function handleFormSubmit(event) {
    event.preventDefault();
    const name = nameInput.value;
    const email = emailInput.value;
    const message = messageInput.value;
    messageToUser.hidden = true;

    // Conditionally execute based on authentication and submission state
    if (isAuthenticated) {
      submitButton.textContent = 'Sending...';
      await emailToDev(name, email, message);
    } else {
      switch (submitButton.textContent) {
        case 'Verify':
          submitButton.textContent = 'Verifying...';
          inputVerificationCode = verificationCodeInput.value;
          await emailToDev(name, email, message, inputVerificationCode);
          break;
        case 'Submit':
          submitButton.textContent = 'Sending verification...';
          await verifyEmail(name, email, message);
          break;
        default:
          break;
      }
    }
  }

  await checkUserStatus();

  form.addEventListener("submit", handleFormSubmit);

}

contactMe();
