//  write review modal
const writeReviewButton = document.querySelector("#write-review-button");
const modal = document.createElement("div");
modal.classList.add("modal");
writeReviewButton.addEventListener("click", () => {
  let html = `
      <div class="Modal-content">
        <span class="close">&times;</span>
       <form id="newreview" action="/reviews" method="POST" content-type="application/json">
          <p class="Output"></p>
          <ul>
            `;
  for (let i = 0; i < 5; i++) {
    html += `<li class="Star"><i class="fa fa-star"></i>
            <li>`;
  }
  html += `
          </ul>
          <input class="Starvalue" type="hidden" name="Stars" />
          <textarea 
          id="summernote" 
          type="text" 
          name="testimonial" 
          rows="5"
          placeholder="Enter your testimonial here..."></textarea>
          <button id="submit-btn" type="submit">Submit</button>
        </form>
      </div>
    `;
  $(document).ready(function () {
    const stars = Array.from($(".Star"));
    const output = document.querySelector(".Output");
    output.innerHTML = "Please give us Ratings";
    const starvalue = $(".Starvalue");
    const submitBtn = document.getElementById("submit-btn");
    submitBtn.disabled = true;
    submitBtn.style.backgroundColor = "gray";
    submitBtn.style.color = "black";

    // function checkInputs() {
    //   if (starvalue.value !== '') {
    //     submitBtn.disabled = false;
    //   } else {
    //     submitBtn.disabled = true;
    //   }
    // }
    // starvalue.addEventListener('input', checkInputs);

    console.log("inside function===", starvalue.val());
    for (var i = 0; i < stars.length; i++) {
      stars[i].value = i + 1;
      ["click", "mouseover", "mouseout"].forEach(function (e) {
        stars[i].addEventListener(e, showRating);
      });
    }
    function showRating(e) {
      let type = e.type;
      let value = this.value;
      stars.forEach(function (element, index) {
        if (type == "click") {
          if (value >= 1) {
            output.innerHTML = "You rated us " + value + " stars.";
            starvalue.val(value);
            submitBtn.disabled = false;
            submitBtn.style.backgroundColor = "green";
            submitBtn.style.color = "white";
          }
          if (index < value) {
            element.classList.add("clicked");
          } else {
            element.classList.remove("clicked");
          }
        }
        if (type == "mouseover") {
          if (index < value) {
            element.classList.add("orange");
          } else {
            element.classList.remove("orange");
          }
        }
        if (type == "mouseout") {
          element.classList.remove("orange");
        }
      });
    }
  });
  modal.innerHTML = html;
  modal.style.display = "block";
  document.body.appendChild(modal);

  const closeButton = modal.querySelector(".close");
  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });
});
//  end write review modal
