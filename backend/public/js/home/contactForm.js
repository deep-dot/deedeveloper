
function contactMe() {
  const form = document.getElementById("contact-form-viewhome");
  const submitButton = document.getElementById("submit-button");
  const verifyCodeButton = document.getElementById("verify-code-button");
  const verificationCodeInput = document.getElementById("verification-code");
  const verificationCodeLabel = document.getElementById("verification-code-label");
  const messageToUser = document.getElementById("message-to-user");
  let name = '';
  let email = '';
  let message = '';

  form.addEventListener("submit", handleFormSubmit);
  verifyCodeButton.addEventListener("click", handleCodeVerification);

  function handleFormSubmit(event) {
    event.preventDefault();
    name = document.getElementById("name").value;
    email = document.getElementById("email").value;
    message = document.getElementById("message").value;

    toggleLoadingState(submitButton, true);

    fetch("/verifyUserEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, formId: "contact-form-viewhome" }),
    })
      .then(handleResponse)
      .then(data => handleVerificationCodeSent(email))
      .catch(error => handleError(submitButton, messageToUser, error));
  }

  function handleCodeVerification() {
    const inputVerificationCode = verificationCodeInput.value;
    const senddatatoserver = { name, email, verificationCode: inputVerificationCode, message, formId: "contact-form-viewhome" }
    toggleVerifyingState(verifyCodeButton, true);
    fetch('/UserEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(senddatatoserver),
    })
      .then(handleResponse)
      .then(data => {
        if (data.message == 'Invalid verification code') {          
          verifyCodeButton.classList.remove("loading");
          verificationCodeLabel.hidden = true;
          verificationCodeInput.hidden = true;
          verifyCodeButton.hidden = true;
          messageToUser.hidden = false;
          messageToUser.textContent = 'Incorrect verification code. Please try again.';
          messageToUser.style.color = 'red';
          submitButton.style.display = "block";
          submitButton.innerHTML = "Submit";
        }
      }).catch(error => {
        console.log(error);
      });
  }

  function handleResponse(response) {
    //console.log('response==', response);
    if (!response.ok) {      
      verifyCodeButton.classList.remove("loading");
      verificationCodeLabel.hidden = true;
      verificationCodeInput.hidden = true;
      verifyCodeButton.hidden = true;
      messageToUser.hidden = false;
      messageToUser.textContent = 'Email sending failed, please try again';
      messageToUser.style.color = 'red';
      submitButton.style.display = "block";
      submitButton.innerHTML = 'Submit';
    } else {
    verifyCodeButton.classList.remove("loading");
    verificationCodeLabel.hidden = true;
    verificationCodeInput.hidden = true;
    verifyCodeButton.hidden = true;
    messageToUser.hidden = false;
    messageToUser.textContent = 'Email sent successfully';
    submitButton.style.display = "block";
    submitButton.innerHTML = 'Submit';
    form.reset();
    return response.json();
    }
  }

  function handleVerificationCodeSent(email) {    
    verificationCodeInput.hidden = false;
    verifyCodeButton.hidden = false;
    verificationCodeInput.focus();
    submitButton.classList.remove("loading");
    submitButton.style.display = "none";
    messageToUser.textContent = `A verification code has been sent to your email: ${email}. Please check your email and enter the code.`;
    messageToUser.hidden = false;
  }

  function handleError(button, messageElement, error) {
    messageToUser.hidden = false;
    messageToUser.textContent = 'An error occurred. Please try again.';
    messageToUser.style.color = 'red';
    toggleLoadingState(button, false);
    button.innerHTML = "Submit";
  }

  function toggleLoadingState(button, isLoading) {
    if (isLoading) {
      button.classList.add("loading");
      button.innerHTML = "";
    } else {
      button.classList.remove("loading");
      button.innerHTML = "Submit";
    }
  }
  
  function toggleVerifyingState(button, isLoading) {
    if (isLoading) {
      button.classList.add("loading");
      button.innerHTML = "";
    } else {
      button.classList.remove("loading");
      button.innerHTML = "Verrified";
    }
  }
}

// contactMe();

