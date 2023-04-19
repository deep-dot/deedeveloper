
function contactMe () {
const form = document.getElementById('contact-form');
  const submitButton = document.getElementById('submit-button'); 
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    submitButton.innerHTML = '';
    submitButton.classList.add('loading');
    const verificationCode = Math.floor(Math.random() * 900000) + 100000;
    console.log('contact me form====', email, name)
    fetch('/verifyUserEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, verificationCode }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('front verify in contactMe ===',data.success);
        const inputVerificationCode = prompt(`Please enter the verification code that was sent to your email:${email}`);
        if (inputVerificationCode == verificationCode) {
          console.log('matched');
          fetch('/UserEmail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message }),
          })
            .then(response => response.json())
            .then(data => {
              if (data.success) {
                alert('Email sent successfully');
                submitButton.classList.remove('loading');
                submitButton.innerHTML = 'Submit';
                form.reset();
              } else {
                alert('Email sending failed');
                submitButton.classList.remove('loading');
                submitButton.innerHTML = 'Submit';
              }
            }).catch(error => {
              console.log(error);
            });
        } else {
          alert('Incorrect verification code. Please try again.');
          submitButton.classList.remove('loading');
          submitButton.innerHTML = 'Submit';
        }
      })
      .catch(error => {
        console.log('Verification code sending failed', error);
        submitButton.innerHTML = 'Submit';
      });
  });
}
