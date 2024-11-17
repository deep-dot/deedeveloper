document.addEventListener('DOMContentLoaded', () => {
    fetchJsonDataAndRenderReviews();
});

function fetchJsonDataAndRenderReviews() {
    axios.get('/getJsonData')
        .then(res => {
            const { reviews, userid } = res.data;
            let reviewRender = reviews.map((review, index) => renderReview(review, userid, index));
            document.getElementById('reviewCard').innerHTML = reviewRender.join('');
            attachSeeMoreCommentsListeners();
        })
        .catch(error => {
            console.error('Error fetching reviews:', error);
        });
}

function renderReview(review, userid, reviewIndex) {
    let isLiked = review.likers.some(liker => liker.userid === userid);
    let canEdit = JSON.stringify(review.userid) === JSON.stringify(userid);
    let commentsHtml = renderCommentsHtml(review.comments, reviewIndex);
    const shortContent = review.review.slice(0, 150); // Adjust number of characters as needed
    const fullContent = review.review;
    const readMoreToggle = fullContent.length > 150;

    return `
    <div class="card-container">
        <div class="card">
            <div class="cardRow">
                <img src="${review.image}" alt=" ">
                <p>${review.username}</p>
                <ul class="stars">${renderStars(review.stars)}</ul>
                <p>${new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
            <div class="contents">
                  <blockquote class="short-content">${shortContent}...</blockquote>
                  <blockquote class="full-content hidden">${fullContent}</blockquote>
                  ${
                    readMoreToggle
                        ? `<a href="javascript:void(0)" class="read-more-toggle" onclick="toggleReadMore(this)">Read More</a>`
                        : ''
                  }
            </div>
            <div class="cardbtns">
                ${renderReviewButtons(review, isLiked, canEdit)}
            </div>
        </div>
        ${commentsHtml}
    </div>`;
}

// button for contents in renderReview function above
function toggleReadMore(link) {
    const projectContent = link.parentElement;
    const shortContent = projectContent.querySelector(".short-content");
    const fullContent = projectContent.querySelector(".full-content");

    if (fullContent.classList.contains("hidden")) {
        shortContent.classList.add("hidden");
        fullContent.classList.remove("hidden");
        link.textContent = "Read Less";
    } else {
        shortContent.classList.remove("hidden");
        fullContent.classList.add("hidden");
        link.textContent = "Read More";
    }
}

function renderStars(stars) {
    let starHtml = '';
    for (let k = 0; k < 5; k++) {
        starHtml += `<i class="fa fa-star" style='color:${k < stars ? 'orange' : 'grey'}; margin:5px; font-size:14px'></i>`;
    }
    return starHtml;
}

function renderReviewButtons(review, isLiked, canEdit) {
    return `
    <a href="/review/${review._id}/comment" style="float:right;" class="btnn">
        <i class="fa fa-comment"></i><span style="margin-left:4px">${review.comments.length}</span>
    </a>
    <span class="${isLiked ? 'like' : 'unlike'}" onclick="toggleLikeReview(this)" id="${review._id}">
        <i class="fa fa-thumbs-up"></i><ins style="text-decoration: none; margin-left:4px">${review.likers.length}</ins>
    </span>
    ${canEdit ? `
    <span class="btnn editButton" onclick="showModal(this)" reviewContent="${review.review}" reviewId="${review._id}" reviewStars="${review.stars}" data-toggle="modal" data-target="#ReviewEditModalCenter">
        <i class="far fa-edit"></i>
    </span>
    <span class="btnn" onclick="deleteReview(this)" id="${review._id}">
        <i class="fa fa-trash"></i>
    </span>` : ''}`;
}

function attachSeeMoreCommentsListeners() {
    document.querySelectorAll('.see-more-comments').forEach(button => {
        const reviewIndex = button.getAttribute('data-review-index');
        button.addEventListener('click', function () {
            toggleCommentsDisplay(reviewIndex, button);
        });
    });
}

function toggleCommentsDisplay(reviewIndex, button) {
    const commentsContainer = document.querySelectorAll('.comments-container')[reviewIndex];
    const comments = commentsContainer.querySelectorAll('.comment');
    const initiallyVisibleComments = 2;
    const isShowingMore = button.getAttribute('data-showing-more') === 'true';

    if (isShowingMore) {
        comments.forEach((comment, index) => {
            if (index >= initiallyVisibleComments) {
                comment.style.display = 'none';
            }
        });
        button.textContent = 'Show More Comments';
        button.setAttribute('data-showing-more', 'false');
    } else {
        comments.forEach(comment => comment.style.display = '');
        button.textContent = 'Show Less Comments';
        button.setAttribute('data-showing-more', 'true');
    }
}

function renderCommentsHtml(comments, reviewIndex) {
    let commentsHtml = comments.map(comment => renderCommentHtml(comment)).join('');
    commentsHtml = comments.map((comment, index) => {
        const displayStyle = index < 2 ? '' : ' style="display:none;"';
        return renderCommentHtml(comment, displayStyle);
    }).join('');

    let seeMoreButtonHtml = comments.length > 2 ? `<button class="see-more-comments" data-review-index="${reviewIndex}" data-showing-more="false">Show More Comments</button>` : '';
    return `<div class="comments-container">${commentsHtml}</div>${seeMoreButtonHtml}`;
}

function renderCommentHtml(comment, displayStyle = '') {
    return `<div class="comment"${displayStyle}>${comment.content} - ${comment.username}</div>`;
}
