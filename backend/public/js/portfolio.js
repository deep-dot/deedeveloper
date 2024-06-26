document.addEventListener('DOMContentLoaded', () => {
    function initNavbar() {
        const navbar = document.querySelector('.navbar');
        const more = document.querySelector('.more > a');
        const dropdown = document.querySelector('.more .dropdown-content');
        const navsection = document.querySelector('.navsection');
        const mainSection = document.querySelector('main');

        function closeDropdown() {
            dropdown.style.display = 'none';
            navsection.style.background = 'linear-gradient(180deg, rgba(153,134,95,1) 0%, rgba(255,224,158,1) 50%)';
            mainSection.style.paddingTop = 0;
        }

         // https://www.w3schools.com/js/js_htmldom_eventlistener.asp
        more.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();

            if (dropdown.style.display === 'flex') {
                closeDropdown();
            } else {
                dropdown.style.display = 'flex';
                const height = navbar.offsetHeight;
                mainSection.style.paddingTop = `${height}px`;
            }
        });

        document.body.addEventListener('click', function () {
            closeDropdown();
        });
    }

    function burgerMenu() {
        const burger = document.querySelector('.burger');
        if (burger) {
            const navLinks = document.querySelector('.nav-links');
            burger.addEventListener('click', function () {
                navLinks.classList.toggle('active');

                if (navLinks.classList.contains('active')) {
                    navLinks.style.width = '100%';
                } else {
                    navLinks.style.width = '';
                }
            });
        } else {
            console.error('Burger menu button not found!');
        }
    }

    // render json data using html and javascript
    // https://dizzpy.medium.com/how-to-connect-html-with-json-using-javascript-a-beginners-guide-25e94306fa0f
    function renderMemberships() {
        const container = document.getElementById('memberships-container');
        const membershipsData = [
            {
                name: "Federation University Ballarat",
                description: "Currently pursuing a Bachelor's Degree in Information Technology, focusing on software development and data structures.",
                website: "https://federation.edu.au/",
                logo: "https://federation.edu.au/__data/assets/image/0011/466859/FED_colour_logo_large.png"
            },
            {
                name: "Freelance Platform Deedeveloper.com",
                description: "A platform providing design, development, and consulting services to those in need within the IT industry.",
                website: "http://deedeveloper.com",
                logo: "../images/logo.png"
            },
            {
                name: "Professional Software Developers Association",
                description: "An organization dedicated to advancing the skills of software developers through conferences, workshops, and resources.",
                website: "https://www.psda.org",
                logo: "../images/PSDA.png"
            },
            {
                name: "Web Designers Forum",
                description: "A community for web designers and developers to share knowledge, trends, tools, and best practices.",
                website: "https://www.webdesignforum.com",
                logo: "../images/webDesignForum.png"
            }
        ];

        container.innerHTML = '';
        membershipsData.forEach(item => {
            const section = document.createElement('div');
            section.className = 'membership';
            section.innerHTML = `
              <img src="${item.logo}" alt="Organization Logo">
              <div>
                  <h2>${item.name}</h2>
                  <p>${item.description}</p>
                  <a href="${item.website}">Visit Website</a>
              </div>
          `;
            container.appendChild(section);
        });
    }

    // https://www.codebrainer.com/blog/contact-form-in-javascript
    function initContactForm() {
        const form = document.querySelector('form');
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        const subscribeCheckbox = document.getElementById('subscribe');

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            if (validateForm()) {
                displayMessage("Form submitted successfully!", 'success');
            } else {
                displayMessage("Please fill in all fields correctly.", 'error');
            }
        });

        function validateForm() {
            if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
                return false;
            }
            if (!validateEmail(emailInput.value)) {
                return false;
            }
            return true;
        }

        // https://javascript.plainenglish.io/how-to-validate-an-email-address-in-javascript-4d5e04c9d008
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email.toLowerCase());
        }

        function displayMessage(message, type) {
            const messageElement = document.createElement('div');
            messageElement.textContent = message;
            messageElement.className = type === 'success' ? 'success' : 'error';
            document.body.appendChild(messageElement);

            setTimeout(() => {
                document.body.removeChild(messageElement);
            }, 5000);
        }
    }

    /* https://youtu.be/9HcxHDS2w1s?si=Z7ct9sWLpOH4MsbM */
    function initCarousel() {
        const buttons = document.querySelectorAll("[data-carousel-button]");
        
        buttons.forEach(button => {
            button.addEventListener("click", () => {
                const offset = button.dataset.carouselButton === "next" ? 1 : -1;
                const slides = button.closest("[data-carousel]").querySelector("[data-slides]");

                const activeSlide = slides.querySelector("[data-active]");
                let newIndex = [...slides.children].indexOf(activeSlide) + offset;
                if (newIndex < 0) newIndex = slides.children.length - 1;
                if (newIndex >= slides.children.length) newIndex = 0;

                slides.children[newIndex].dataset.active = true;
                delete activeSlide.dataset.active;
            });
        });
    }

    initNavbar();
    burgerMenu();

    
    if (document.getElementById('memberships-container')) {
        renderMemberships();
    }
    if (document.querySelector('form')) {
        initContactForm();
    }
    if (document.querySelector('[data-carousel-button]')) {
        initCarousel();
    }
});
