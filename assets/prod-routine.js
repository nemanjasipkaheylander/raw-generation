
  document.addEventListener('DOMContentLoaded', function () {
    const swiper = new Swiper('.routine-swiper', {
      direction: 'horizontal',
      loop: false,
      slidesPerView: 1.2,
      spaceBetween: 20,

      navigation: {
        nextEl: '.collection-button-next',
        prevEl: '.collection-button-prev',
      },

      breakpoints: {
        768: {
          slidesPerView: 2.2,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 40,
        },
      },
    });
  });
