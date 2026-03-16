document.addEventListener('DOMContentLoaded', function () {
  const swiper = new Swiper('.routine-swiper', {
    direction: 'horizontal',
    loop: false,
    slidesPerView: 1.2,
    spaceBetween: 20,

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

  document.querySelectorAll('.collection-button-prev').forEach(btn => {
    btn.addEventListener('click', () => swiper.slidePrev());
  });

  document.querySelectorAll('.collection-button-next').forEach(btn => {
    btn.addEventListener('click', () => swiper.slideNext());
  });
});