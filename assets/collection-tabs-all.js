document.addEventListener("DOMContentLoaded", function () {
  const swiperContainers = document.querySelectorAll(".swiper-collection");

  swiperContainers.forEach(function (container) {
    const slides = container.querySelectorAll(".swiper-slide");
    const slideCount = slides.length;

    // Thresholds for enabling slider
    const mobileThreshold = 2; // Enable slider on mobile when more than 2 items
    const desktopThreshold = 4; // Enable slider on desktop when more than 4 items

    function shouldEnableSlider() {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        return slideCount > mobileThreshold;
      } else {
        return slideCount > desktopThreshold;
      }
    }

    let swiperInstance = null;

    function initSwiper() {
      if (shouldEnableSlider() && !swiperInstance) {
        swiperInstance = new Swiper(container, {
          // Optional parameters
          loop: false,
          slidesPerView: "auto",
          slidesPerGroup: 1,
          spaceBetween: 20,

          // If we need pagination
          pagination: {
            el: ".swiper-pagination",
          },

          // Navigation arrows
          navigation: {
            nextEl: ".swiper-next",
            prevEl: ".swiper-prev",
          },
        });
      } else if (!shouldEnableSlider() && swiperInstance) {
        swiperInstance.destroy(true, true);
        swiperInstance = null;
      }
    }

    // Initialize on load
    initSwiper();

    // Re-check on window resize
    let resizeTimeout;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(initSwiper, 250);
    });
  });
});
