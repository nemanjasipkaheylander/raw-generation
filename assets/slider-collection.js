
document.addEventListener("DOMContentLoaded", function () {
  new Swiper(".product-swiper", {
    slidesPerView: 1.2,
    spaceBetween: 20,
    loop: false,
    navigation: {
      nextEl: ".product-swiper .collection-button-next",
      prevEl: ".product-swiper .collection-button-prev",
    },
    breakpoints: {
      600: {
        slidesPerView: 3.4,
      },
      1200: {
        slidesPerView: 4.4,
      }
    }
  });
});
