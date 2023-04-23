
function toggleFaq(event) {
    const questionElement = event.currentTarget;
    const answerElement = questionElement.nextElementSibling;
    const toggleIcon = questionElement.querySelector(".toggle-icon");

    if (answerElement.style.maxHeight) {
        answerElement.style.maxHeight = null;
    } else {
        answerElement.style.maxHeight = answerElement.scrollHeight + "px";
    }

    toggleIcon.classList.toggle("open");
    toggleIcon.textContent = answerElement.style.maxHeight ? "-" : "+";
}

