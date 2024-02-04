// function contactMe() {
//   const form = document.getElementById("contact-form-viewhome");
//   const submitButton = document.getElementById("submit-button");
//   const verifyCodeButton = document.getElementById("verify-code-button");
//   const verificationCodeInput = document.getElementById("verification-code");
//   const verificationCodeLabel = document.getElementById("verification-code-label");
//   const messageToUser = document.getElementById("message-to-user");
//   let verificationCode = null;

//   form.addEventListener("submit", (event) => {
//     event.preventDefault();
//     const name = document.getElementById("name").value;
//     const email = document.getElementById("email").value;

//     if (!verificationCode) {
//       submitButton.innerHTML = "";
//       submitButton.classList.add("loading");

//       console.log("Submitting fetch request");
//       fetch("/verifyUserEmail", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, email, formId: "contact-form-viewhome" }),
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           console.log("front verify in contactMe ===", data);
//           verificationCode = data.verificationCode;
//           verificationCodeLabel.hidden = false;
//           verificationCodeInput.hidden = false;
//           verifyCodeButton.hidden = false;
//           verificationCodeInput.focus();
//           submitButton.classList.remove("loading");
//           submitButton.style.display = "none";
//           messageToUser.textContent = `A verification code has been sent to your email: ${email}. Please check your email and enter the code.`;
//           messageToUser.hidden = false;
//         })
//         .catch((error) => {
//           console.log("Verification code sending failed", error);
//           messageToUser.hidden = true;
//           submitButton.style.display = "block";
//           submitButton.innerHTML = "Submit";          
//         });
//     }
//   });

//   verifyCodeButton.addEventListener("click", () => {
//     const name = document.getElementById("name").value;
//     const email = document.getElementById("email").value;
//     const message = document.getElementById("message").value;
//     verifyCodeButton.classList.add("loading");
//     const inputVerificationCode = verificationCodeInput.value;
//     if (inputVerificationCode == verificationCode) {
//       console.log("matched", verificationCode);
//       fetch('/UserEmail', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name, email, msg: message, formId: "contact-form-viewhome" }),
//       })
//         .then(response => response.json())
//         .then(data => {
//           if (data.success) {
//             alert('Email sent successfully');
//             verifyCodeButton.classList.remove("loading");
//             verificationCodeLabel.hidden = true;
//             verificationCodeInput.hidden = true;
//             verifyCodeButton.hidden = true;
//             messageToUser.hidden = true;
//             submitButton.style.display = "block";
//             submitButton.innerHTML = 'Submit';
//             form.reset();
//           } else {
//             alert('Email sending failed, please try again');
//             verifyCodeButton.classList.remove("loading");
//             verificationCodeLabel.hidden = true;
//             verificationCodeInput.hidden = true;
//             verifyCodeButton.hidden = true;
//             messageToUser.hidden = true;
//             submitButton.style.display = "block";
//             submitButton.innerHTML = 'Submit';
//           }
//         }).catch(error => {
//           console.log(error);
//         });
//     } else {
//       alert("Incorrect verification code. Please try again.");
//       verifyCodeButton.classList.remove("loading");
//       verificationCodeLabel.hidden = true;
//       verificationCodeInput.hidden = true;
//       verifyCodeButton.hidden = true;
//       messageToUser.hidden = true;
//       submitButton.style.display = "block";
//       submitButton.innerHTML = "Submit";
//     }    
//   });

//  }

// // contactMe();



function contactMe() {
  const form = document.getElementById("contact-form-viewhome");
  const submitButton = document.getElementById("submit-button");
  const verifyCodeButton = document.getElementById("verify-code-button");
  const verificationCodeInput = document.getElementById("verification-code");
  const verificationCodeLabel = document.getElementById("verification-code-label");
  const messageToUser = document.getElementById("message-to-user");

  form.addEventListener("submit", handleFormSubmit);
  verifyCodeButton.addEventListener("click", handleCodeVerification);

  function handleFormSubmit(event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    toggleLoadingState(submitButton, true);

    fetch("/verifyUserEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, formId: "contact-form-viewhome" }),
    })
      .then(handleResponse)
      .then(data => handleVerificationCodeSent(data, email))
      .catch(error => handleError(submitButton, messageToUser, error));
  }

  function handleCodeVerification() {
    const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;
        verifyCodeButton.classList.add("loading");
          fetch('/UserEmail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, msg: message, formId: "contact-form-viewhome" }),
          })
            .then(response => response.json())
            .then(data => {
              if (data.success) {
                alert('Email sent successfully');
                verifyCodeButton.classList.remove("loading");
                verificationCodeLabel.hidden = true;
                verificationCodeInput.hidden = true;
                verifyCodeButton.hidden = true;
                messageToUser.hidden = true;
                submitButton.style.display = "block";
                submitButton.innerHTML = 'Submit';
                form.reset();
              } else {
                alert('Email sending failed, please try again');
                verifyCodeButton.classList.remove("loading");
                verificationCodeLabel.hidden = true;
                verificationCodeInput.hidden = true;
                verifyCodeButton.hidden = true;
                messageToUser.hidden = true;
                submitButton.style.display = "block";
                submitButton.innerHTML = 'Submit';
              }
            }).catch(error => {
              console.log(error);
            });
  }

  function handleResponse(response) {
    if (!response.ok) {
      throw new Error('Server responded with a status: ' + response.status);
    }
    return response.json();
  }

  function handleVerificationCodeSent(data, email) {
    console.log("front verify in contactMe ===", data);
   // verificationCodeInput = data.verificationCode;
    verificationCodeLabel.hidden = false;
    verificationCodeInput.hidden = false;
    verifyCodeButton.hidden = false;
    verificationCodeInput.focus();
    submitButton.classList.remove("loading");
    submitButton.style.display = "none";
    messageToUser.textContent = `A verification code has been sent to your email: ${email}. Please check your email and enter the code.`;
    messageToUser.hidden = false;
  }

  function handleError(button, messageElement, error) {
    console.error("An error occurred", error);
    messageElement.hidden = true;
    toggleLoadingState(button, false);
    button.innerHTML = "Submit";
    alert('An error occurred. Please try again.');
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
}

// contactMe();

