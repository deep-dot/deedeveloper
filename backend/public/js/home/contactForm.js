
// function contactMe() {
//   const form = document.getElementById("contact-form-viewhome");
//   const submitButton = document.getElementById("submit-button");
//   const verifyCodeButton = document.getElementById("verify-code-button");
//   const verificationCodeInput = document.getElementById("verification-code");
//   const verificationCodeLabel = document.getElementById("verification-code-label");
//   const messageToUser = document.getElementById("message-to-user");
//   let name = '';
//   let email = '';
//   let message = '';

//   form.addEventListener("submit", handleFormSubmit);
//   verifyCodeButton.addEventListener("click", handleCodeVerification);

//   function handleFormSubmit(event) {
//     event.preventDefault();
//     name = document.getElementById("name").value;
//     email = document.getElementById("email").value;
//     message = document.getElementById("message").value;

//     toggleLoadingState(submitButton, true);

//     fetch("/verifyUserEmail", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name, email, formId: "contact-form-viewhome" }),
//     })
//       .then(handleResponse)
//       .then(data => handleVerificationCodeSent(email))
//       .catch(error => handleError(submitButton, messageToUser, error.message));
//   }

//   function handleCodeVerification() {
//     const inputVerificationCode = verificationCodeInput.value;
//     const senddatatoserver = { name, email, verificationCode: inputVerificationCode, message, formId: "contact-form-viewhome" }
//     toggleVerifyingState(verifyCodeButton, true);
//     fetch('/UserEmail', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(senddatatoserver),
//     })
//       .then(handleResponse)
//       .then(data => {
//         if (data.message == 'Invalid verification code') {
//           verifyCodeButton.classList.remove("loading");
//           verificationCodeLabel.hidden = true;
//           verificationCodeInput.hidden = true;
//           verifyCodeButton.hidden = true;
//           messageToUser.hidden = false;
//           messageToUser.textContent = 'Incorrect verification code';
//           messageToUser.style.color = 'red';
//           submitButton.style.display = "block";
//           submitButton.innerHTML = "Submit";
//         } else {
//           verifyCodeButton.classList.remove("loading");
//           verificationCodeLabel.hidden = true;
//           verificationCodeInput.hidden = true;
//           verifyCodeButton.hidden = true;
//           messageToUser.hidden = false;
//           messageToUser.textContent = 'Email sent successfully';
//           messageToUser.style.color = 'green';
//           submitButton.style.display = "block";
//           submitButton.innerHTML = 'Submit';
//           form.reset();
//         }
//       }).catch(error => {
//         console.log(error);
//         handleError(verifyCodeButton, messageToUser, error.message);
//       });
//   }

//   function handleResponse(response) {
//     return response.json().then(data => {
//       if (!response.ok || !data.success) {
//         verifyCodeButton.classList.remove("loading");
//         verificationCodeLabel.hidden = true;
//         verificationCodeInput.hidden = true;
//         verifyCodeButton.hidden = true;        
//         submitButton.style.display = "block";
//         submitButton.innerHTML = 'Submit';
//         throw new Error(data.message || 'Email sending failed, please try again');
//       }
//       return data; // Continue with the resolved data for successful cases
//     });
//   }

//   function handleVerificationCodeSent(email) {
//     verificationCodeInput.hidden = false;
//     verifyCodeButton.hidden = false;
//     verificationCodeInput.focus();
//     submitButton.classList.remove("loading");
//     submitButton.style.display = "none";
//     messageToUser.textContent = `A verification code has been sent to your email: ${email}. Please check your email and enter the code.`;
//     messageToUser.style.color = 'green';
//     messageToUser.hidden = false;
//   }

//   function handleError(button, messageElement, errorMsg) {
//     messageElement.hidden = false;
//     messageElement.textContent = errorMsg;
//     messageElement.style.color = 'red';
//     toggleLoadingState(button, false);
//     button.innerHTML = "Submit";
//   }

//   function toggleLoadingState(button, isLoading) {
//     if (isLoading) {
//       button.classList.add("loading");
//       button.innerHTML = "";
//     } else {
//       button.classList.remove("loading");
//       button.innerHTML = "Submit";
//     }
//   }

//   function toggleVerifyingState(button, isLoading) {
//     if (isLoading) {
//       button.classList.add("loading");
//       button.innerHTML = "";
//     } else {
//       button.classList.remove("loading");
//       button.innerHTML = "Verrified";
//     }
//   }
// }

// // contactMe();


async function contactMe() {
  const form = document.getElementById("contact-form-viewhome");
  const submitButton = document.getElementById("submit-button");
  const verifyCodeButton = document.getElementById("verify-code-button");
  const verificationCodeInput = document.getElementById("verification-code");
  const verificationCodeLabel = document.getElementById("verification-code-label");
  const messageToUser = document.getElementById("message-to-user");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");

  // Initialize as not authenticated
  let isAuthenticated = false;
  let userDetails = {};

  // Check user authentication status and fill form if authenticated
  async function checkUserStatus() {
    try {
      const authStatusResponse = await fetch('/api/auth/status');
      const authStatusData = await authStatusResponse.json();
      isAuthenticated = authStatusData.isAuthenticated;

      if (isAuthenticated) {
        const userDetailsResponse = await fetch('/api/auth/userDetail');
        userDetails = await userDetailsResponse.json();

        // Fill and disable the name and email fields
        nameInput.value = userDetails.userName;
        emailInput.value = userDetails.userEmail;
        nameInput.setAttribute('readonly', true);
        emailInput.setAttribute('readonly', true);

        // Hide verification UI elements
        verifyCodeButton.style.display = 'none';
        verificationCodeInput.style.display = 'none';
        verificationCodeLabel.style.display = 'none';
      }
    } catch (error) {
      console.error('Failed to fetch user status', error);
    }
  }

  // Handle form submission
  async function handleFormSubmit(event) {
    event.preventDefault();
    const name = nameInput.value;
    const email = emailInput.value;
    const message = messageInput.value;

    toggleLoadingState(submitButton, true);

    if (isAuthenticated) {
      sendEmailDirectly(name, email, message);
    } else {
      requestEmailVerification(name, email, message);
    }
  }

  // Directly send email without verification
  async function sendEmailDirectly(name, email, message) {
    const senddatatoserver = { name, email, message, formId: "contact-form-viewhome", bypassVerification: true };
    try {
      const response = await fetch('/UserEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(senddatatoserver),
      });
      const data = await response.json();
      if (data.success) {
        messageToUser.textContent = 'Email sent successfully';
        messageToUser.style.color = 'green';
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      handleError(submitButton, messageToUser, error.message);
    } finally {
      toggleLoadingState(submitButton, false);
    }
  }

  // Request email verification (for non-authenticated users)
  async function requestEmailVerification(name, email, message) {
    const verificationRequestData = { name, email, message, formId: "contact-form-viewhome" };
    try {
      const response = await fetch("/verifyUserEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(verificationRequestData),
      });
      const data = await handleResponse(response);
      handleVerificationCodeSent(email);
    } catch (error) {
      handleError(submitButton, messageToUser, error.message);
    } finally {
      toggleLoadingState(submitButton, false);
    }
  }

  function handleResponse(response) {
    return response.json().then(data => {
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Email sending failed, please try again');
      }
      return data; // Continue with the resolved data for successful cases
    });
  }

  function handleVerificationCodeSent(email) {
    verificationCodeInput.hidden = false;
    verifyCodeButton.hidden = false;
    verificationCodeInput.focus();
    submitButton.classList.remove("loading");
    submitButton.style.display = "none";
    messageToUser.textContent = `A verification code has been sent to your email: ${email}. Please check your email and enter the code.`;
    messageToUser.style.color = 'green';
    messageToUser.hidden = false;
  }

  function handleError(button, messageElement, errorMsg) {
    messageElement.hidden = false;
    messageElement.textContent = errorMsg;
    messageElement.style.color = 'red';
    toggleLoadingState(button, false);
    button.innerHTML = "Submit";
  }

  function toggleLoadingState(button, isLoading) {
    if (isLoading) {
      button.classList.add("loading");
      button.innerHTML = "Loading...";
    } else {
      button.classList.remove("loading");
      button.innerHTML = "Submit";
    }
  }

  function toggleVerifyingState(button, isLoading) {
    if (isLoading) {
      button.classList.add("loading");
      button.innerHTML = "Verifying...";
    } else {
      button.classList.remove("loading");
      button.innerHTML = "Verify";
    }
  }

  async function handleCodeVerification() {
    const inputVerificationCode = verificationCodeInput.value;
    const verificationData = { name: nameInput.value, email: emailInput.value, verificationCode: inputVerificationCode, message: messageInput.value, formId: "contact-form-viewhome" };
    try {
      const response = await fetch('/UserEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verificationData),
      });
      const data = await handleResponse(response);
      if (data.message === 'Email sent successfully') {
        messageToUser.textContent = 'Email sent successfully';
        messageToUser.style.color = 'green';
      }
    } catch (error) {
      handleError(verifyCodeButton, messageToUser, error.message);
    } finally {
      toggleVerifyingState(verifyCodeButton, false);
    }
  }

  await checkUserStatus();
  form.addEventListener("submit", handleFormSubmit);
  if (!isAuthenticated) {
    verifyCodeButton.addEventListener("click", handleCodeVerification);
  }
}

contactMe();
