

const showModal = (self) => {
    console.log('self===', self.getAttribute('reviewStars'));
    var numberOfStars = self.getAttribute('reviewStars');
    var reviewId = self.getAttribute('reviewId');
    var reviewStars = '';
    for (var a = 0; a < 5; a++) {
        if (a < numberOfStars) {
            reviewStars += `<li class="star"><i class="fa fa-star" style='color:orange; margin:5px; font-size:14px'></i></li>`
        } else {
            reviewStars += `<li class="star"><i class="fa fa-star" style='color:grey; margin:5px; font-size:14px'></i></li>`
        }
    }
    var editButton = document.getElementById("editButton");
    const modalEdit = document.createElement('div');
    modalEdit.classList.add('modal');
    let html = `
      <div class="Modal-content">
        <span class="close">&times;</span>
        <h3>Edit Review ${numberOfStars}</h3>
        <form id="edit-form" action="/reviews/edit?_method=PUT" method="POST" content-type='application/json'>
            <ul>
              `
    for (let i = 0; i < 5; i++) {
        if (i < numberOfStars) {
            html += `<li class="Star"><i class="fa fa-star" style='color:orange; margin:5px; font-size:14px'></i></li>`
        } else {
            html += `<li class="Star"><i class="fa fa-star" style='color:grey; margin:5px; font-size:14px'></i></li>`
        }
    }
    html += `
        </ul>
        <label for="rating">Rating:</label>
          <p class="output"></p>
          <ul>       `
    for (let i = 0; i < 5; i++) {
        html += `<li class="star"><i class="fa fa-star"></i>
            <li>`
    }
    html += `
          </ul>
          <label for="review">Review:</label>
         <input class="starvalue" type="hidden" name="stars">
          <input class="reviewId" type="hidden" name="reviewId">
            <input type="text" name="review" style="width:100%; border:none; height:50px; outline: none">
              <div class="modal-footer">
                <button id="submit-btn" type="submit">Submit</button>
              </div>
            </form>
          </div>
    `;

    $(document).ready(function () {
        const stars = Array.from($('.star'));
        const output = $('.output');
        output.innerHTML = 'Please give us Ratings'
        const starvalue = $('.starvalue');
        console.log('starvalue==', starvalue.val())
        $('.reviewId').val(reviewId);
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.disabled = true;
        submitBtn.style.backgroundColor = 'gray';
        submitBtn.style.color = 'black';
        for (var i = 0; i < stars.length; i++) {
            stars[i].value = i + 1;
            ["click", "mouseover", "mouseout"].forEach(function (e) {
                stars[i].addEventListener(e, showRating);
            })
        }
        function showRating(e) {
            let type = e.type;
            let value = this.value;
            stars.forEach(function (element, index) {
                if (type == 'click') {
                    if (value >= 1) {
                        output.html("You rated us " + value + " stars.");
                        starvalue.val(value);
                        submitBtn.disabled = false;
                        submitBtn.style.backgroundColor = 'green';
                        submitBtn.style.color = 'white';
                    }
                    if (index < value) {
                        element.classList.add("clicked");
                    } else {
                        element.classList.remove("clicked");
                    }
                }
                if (type == 'mouseover') {
                    if (index < value) {
                        element.classList.add('orange');
                    } else {
                        element.classList.remove('orange');
                    }
                }
                if (type == 'mouseout') {
                    element.classList.remove('orange')
                }
            });
        }
    });
    modalEdit.innerHTML = html;
    modalEdit.style.display = 'block';
    document.body.appendChild(modalEdit);
    const closeButton = modalEdit.querySelector('.close');
    closeButton.addEventListener('click', () => {
        modalEdit.style.display = 'none';
    });
}

window.showModal = showModal;
