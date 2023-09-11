function resetToOriginal() {
    if (window.innerWidth >= 450) {
      window.location.href = "../index.html"; // Navigate to public/index.html
    }
  }
  
  // Call the resetToOriginal function when the page loads
  resetToOriginal();
  
  // Listen for the resize event and call resetToOriginal when the screen size changes
  window.addEventListener('resize', resetToOriginal);
  // JavaScript redirect to mobile version if screen width is less than a certain value

  
  

// Define a function to handle scrolling behavior for the footer menu
function setupFooterScroll() {
  var prevScrollPos = window.pageYOffset;
  var footerMenu = document.getElementById('footerMenu');

  window.addEventListener('scroll', function() {
      var currentScrollPos = window.pageYOffset;

      if (prevScrollPos > currentScrollPos) { // Scrolling up
          footerMenu.style.transform = 'translateY(0)';
      } else { // Scrolling down
          footerMenu.style.transform = 'translateY(100%)';
      }

      prevScrollPos = currentScrollPos;
  });
}

// Call the setupFooterScroll function to enable the behavior
setupFooterScroll();



//swiper
function initializeSwiper() {
  const swiper = new Swiper('.swiper', {
    // Optional parameters
    autoplay: {
      delay:2000,
      disableOnInteraction:false,
    },

    loop: true,

    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },

    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    // And if we need scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
    },
  });
}

// Call the function to initialize the swiper
initializeSwiper();