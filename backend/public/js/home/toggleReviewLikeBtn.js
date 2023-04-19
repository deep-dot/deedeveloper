function toggleLikeReview(self) {
    console.log ('togglereviewlikebtn===', self);
    axios.post('/toggleLikeReview/' + self.id).then(res => {
      //console.log(res.data)
      if (res.data.status == 'success') {
        self.className = "like";
        var likes = parseInt(self.querySelector("ins").innerHTML);
        likes++;
        self.querySelector("ins").innerHTML = likes;
      }
      if (res.data.status == 'unliked') {
        self.className = "unlike";
        var likes = parseInt(self.querySelector("ins").innerHTML);
        likes--;
        self.querySelector("ins").innerHTML = likes;
      }
      if (res.data.status == 'error') {
        //alert(res.message);
      }
    });
  }

  window.toggleLikeReview = toggleLikeReview;