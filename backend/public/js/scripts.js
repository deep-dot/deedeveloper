var toggle_btn;
var main_wrapper;
var hamburger_menu;
var main;
let dark = false,
  cards,
  blog,
  blog_menu,
  hiddenElements,
  obsever,
  currentLocation,
  menuItems;

function declare() {
  main = document.querySelector("main");
  toggle_btn = document.querySelector(".toggle-btn");
  main_wrapper = document.querySelector(".main-wrapper");
  hamburger_menu = document.querySelector(".hamburger-menu");
  blog = document.querySelector(".blog");
  blog_menu = document.querySelector(".blog-menu");
  currentLocation = window.location.pathname;
  menuItems = document.querySelectorAll(".nav_list > li > a");
}
declare();

function smoothScroll() {
  const menuLinks = document.querySelectorAll('.nav li a[href^="/#"]');
  //console.log('menuLinks===', menuLinks);
  menuLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const targetSection = document.querySelector(`${targetId}`);
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}
window.smoothScroll = smoothScroll;

function events() {
  // dark and light mode
  if (toggle_btn) {
    toggle_btn.addEventListener("click", () => {
      dark = !dark;
      if (dark) {
        main_wrapper.classList.remove("light");
        main_wrapper.classList.add("dark");
      } else {
        main_wrapper.classList.remove("dark");
        main_wrapper.classList.add("light");
      }
    });
  } else {
    console.log("toggle_btn is null");
  }

  //menu
  if (hamburger_menu) {
    hamburger_menu.addEventListener("click", () => {
      main_wrapper.classList.toggle("active");
    });
  } else {
    console.log("hamburger_menu is null");
  }

  // hightlight menu button
  menuItems.forEach((item) => {
    if (item.getAttribute("href") === currentLocation) {
      item.style.color = "tomato";
    }
  });

  // scroll animation
  hiddenElements = document.querySelectorAll(".hidden");
  obsever = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // console.log('entry===',entry);
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      } else {
        entry.target.classList.remove("show");
      }
    });
  });
  hiddenElements.forEach((el) => obsever.observe(el));

  // blog menu button
  if(blog_menu){
  blog_menu.style.display = "none";
  blog.addEventListener("click", () => {
    blog.classList.toggle("active");
    //console.log('blog===', blog);
    if (blog.classList.contains("active")) {
      blog_menu.style.display = "block";
    } else {
      blog_menu.style.display = "none";
    }
  });
} else {
  console.log("blog_menu is null");
}

  //hide navbar while scrolling down
  const header = document.querySelector("header");
  const main_wrapper_active_nav_list = document.querySelector(
    ".main-wrapper.active .nav_list"
  );
  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll < lastScroll) {
      header.classList.remove("hidden");
    } else {
      header.classList.add("hidden");
    }
    lastScroll = currentScroll;
  });
}
events();

function showMoreLess(
  numOfReviews,
  numOfVisibleCards,
  showAllCards,
  seeMoreButton
) {
  // console.log('function called', numOfReviews, showAllCards,numOfVisibleCards);
  for (let i = 0; i < numOfReviews; i++) {
    cards = document.querySelectorAll(".card-container");
    if (i < numOfVisibleCards) {
      cards[i].style.display = "block";
      cards[i].style.margin = "10px";
    } else {
      cards[i].style.display = "none";
    }
  }
  console.log("see more button===", numOfReviews, numOfVisibleCards);
  if (numOfReviews >= numOfVisibleCards) {
    seeMoreButton.textContent = showAllCards ? "See less" : "See more";
    seeMoreButton.style.display = "block";
  } else {
    seeMoreButton.style.display = "none";
  }
}

function seeNumOfCardsLessOrMore(numOfReviews) {
  let showAllCards = false;
  let numOfVisibleCards = 2;
  let seeMoreButton = document.querySelector("#see-more-button");
  seeMoreButton.addEventListener("click", () => {
    showAllCards = !showAllCards;
    numOfVisibleCards = showAllCards ? numOfReviews : 2;
    showMoreLess(numOfReviews, numOfVisibleCards, showAllCards, seeMoreButton);
  });
  showMoreLess(numOfReviews, numOfVisibleCards, showAllCards, seeMoreButton);
}



// $(document).ready(function() {
//   // Initial Declarations
//   let dark = false;
//   let currentLocation = window.location.pathname;
  
//   // Smooth Scroll
//   $('.nav li a[href^="/#"]').click(function(e) {
//     e.preventDefault();
//     let targetId = $(this).attr('href').substring(1);
//     if ($('#' + targetId).length > 0) {
//       $('#' + targetId).get(0).scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//     }
//   });
  
//   // Dark and Light mode
//   $(".toggle-btn").click(function() {
//     dark = !dark;
//     if (dark) {
//       $(".main-wrapper").removeClass("light").addClass("dark");
//     } else {
//       $(".main-wrapper").removeClass("dark").addClass("light");
//     }
//   });

//   // Menu
//   $(".hamburger-menu").click(function() {
//     $(".main-wrapper").toggleClass("active");
//   });

//   // Highlight menu button
//   $(".nav_list > li > a").each(function() {
//     if ($(this).attr("href") === currentLocation) {
//       $(this).css("color", "tomato");
//     }
//   });

//   // Scroll animation
//   let observer = new IntersectionObserver((entries) => {
//     entries.forEach((entry) => {
//       if (entry.isIntersecting) {
//         $(entry.target).addClass("show");
//       } else {
//         $(entry.target).removeClass("show");
//       }
//     });
//   });

//   $(".hidden").each(function() {
//     observer.observe(this);
//   });

//   // Blog menu button
//   $(".blog").click(function() {
//     $(this).toggleClass("active");
//     if ($(this).hasClass("active")) {
//       $(".blog-menu").show();
//     } else {
//       $(".blog-menu").hide();
//     }
//   });

//   // Hide navbar while scrolling down
//   let lastScroll = 0;
//   $(window).scroll(function() {
//     let currentScroll = $(window).scrollTop();
//     if (currentScroll < lastScroll) {
//       $("header").removeClass("hidden");
//     } else {
//       $("header").addClass("hidden");
//     }
//     lastScroll = currentScroll;
//   });

//   // Show More/Less
//   function showMoreLess(numOfReviews, numOfVisibleCards, showAllCards, seeMoreButton) {
//     $(".card-container").each(function(index) {
//       if (index < numOfVisibleCards) {
//         $(this).show().css("margin", "10px");
//       } else {
//         $(this).hide();
//       }
//     });
//     if (numOfReviews >= numOfVisibleCards) {
//       $(seeMoreButton).text(showAllCards ? "See less" : "See more").show();
//     } else {
//       $(seeMoreButton).hide();
//     }
//   }

//   function seeNumOfCardsLessOrMore(numOfReviews) {
//     let showAllCards = false;
//     let numOfVisibleCards = 2;
//     let seeMoreButton = $("#see-more-button");
//     $(seeMoreButton).click(function() {
//       showAllCards = !showAllCards;
//       numOfVisibleCards = showAllCards ? numOfReviews : 2;
//       showMoreLess(numOfReviews, numOfVisibleCards, showAllCards, seeMoreButton);
//     });
//     showMoreLess(numOfReviews, numOfVisibleCards, showAllCards, seeMoreButton);
//   }
// });

// seeNumOfCardsLessOrMore();

