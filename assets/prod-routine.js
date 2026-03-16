document.addEventListener('DOMContentLoaded', function () {
  const swiper = new Swiper('.routine-swiper', {
    direction: 'horizontal',
    loop: false,
    slidesPerView: 1.2,
    spaceBetween: 20,

    breakpoints: {
      768: {
        slidesPerView: 2.2,
        spaceBetween: 24,
      },
      1024: {
        slidesPerView: 3.2,
        spaceBetween: 24,
      },
    },
  });

  const prevBtns = document.querySelectorAll('.collection-button-prev');
  const nextBtns = document.querySelectorAll('.collection-button-next');

  function updateButtons() {
    prevBtns.forEach(btn => {
      btn.classList.toggle('swiper-button-disabled', swiper.isBeginning);
    });
    nextBtns.forEach(btn => {
      btn.classList.toggle('swiper-button-disabled', swiper.isEnd);
    });
  }

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      swiper.slidePrev();
      updateButtons();
    });
  });

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      swiper.slideNext();
      updateButtons();
    });
  });

  // Inicijalno stanje
  updateButtons();
});