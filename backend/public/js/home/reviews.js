axios.get('/getJsonData').then(res => {
    var reviews = res.data.reviews;
    var userid = res.data.userid;
    var reviewRender = [];
    let likers = 0, canEdit = false, isLiked = false;
    reviews.forEach((review, index) => {
        var className = "";
        var canEditClass = "";

        likers = review.likers;
        for (var j = 0; j < likers.length; j++) {
            if (review.likers[j].userid == userid) {
                isLiked = true;
                break;
            }
        }
        if (JSON.stringify(review.userid) === JSON.stringify(userid)) {
            canEdit = true;
        }


        if (isLiked) {
            className = "like";
        } else {
            className = "unlike";
        }

        var html = ''
        html += '<div class="card-container">' //for see more and see less button
        html += '<div class="card">' 

        html += '<div class="cardRow">'
        html += `<img src=${review.image} alt=" " />`
        html += `<p>${review.username}</p>`
        html += '<ul class="stars">'
        for (var k = 0; k < 5; k++) {
            // console.log('stars in home.ejs', review.stars);
            if (k < review.stars) {
                html += `<i class="fa fa-star" style='color:orange; margin:5px; font-size:14px'></i>`
            } else {
                html += `<i class="fa fa-star" style='color:grey; margin:5px; font-size:14px'></i>`
            }
        }
        html += '</ul>'
        html += `<p>${review.createdAt.slice(0, 10)}</p>`
        html += '</div>'

        html += '<div class="contents">'
        html += `<blockquote> ${review.review}</blockquote>`
        html += '</div>'

        html += '<div class="cardRow">'

        html += '<div id="reviewComment">'
        html += `<a href="/review/${review._id}/comment" style="float:right;" class="btnn">`
        html += '<i class="fa fa-comment"></i>'
        html += `<span style="margin-left:4px">${review.comments.length}</span>`
        html += '</a>'
        html += '</div>'

        html += '<div>';
        html += `<span class="${className}" onclick="toggleLikeReview(this)" id="${review._id}">`;
        html += '<i class="fa fa-thumbs-up"></i>';
        html += `<ins style="text-decoration: none; margin-left:4px">${review.likers.length}</ins>`;
        html += '</span>';
        html += '</div>';

        if (canEdit) {
            html += '<div>'
            html += `<span class="btnn editButton" onclick="showModal(this)" reviewContent="${review.review}" reviewId="${review._id}" reviewStars="${review.stars}" data-toggle="modal" data-target="#ReviewEditModalCenter">`
            html += '<i class="far fa-edit"></i>'
            html += '</span>'
            html += '</div>'

            html += '<div>'
            html += `<span class="btnn" onclick="deleteReview(this)"  id="${review._id}">`
            html += '<i class="fa fa-trash"></i>'
            html += '</span>'
            html += '</div>'
        }
        html += '</div>'

        html += '<div class="morelessmore"></div>'

         html += '</div>'
         html += '</div>'

        reviewRender.push(html);
    });
    $('#reviewCard').html(reviewRender);

    var numOfReviews = 0;
    if (reviews) {
        numOfReviews = reviews.length;
    }
    //document.addEventListener('DOMContentLoaded', () => {
    seeNumOfCardsLessOrMore(numOfReviews);
    morelessmore();
    //});

}).catch(error => {
    console.log('Error fetching number of reviews:', error);
});