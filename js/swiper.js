var swiper = new Swiper(".mySwiper", {
    slidesPerView: 2,
    centeredSlides: true,
    loop: true,
    centeredSlides: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
    spaceBetween: 20,
    grabCursor: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      '@0.75': {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      '@1.00': {
        slidesPerView: 4,
        spaceBetween: 40,
      },
      '@1.50': {
        slidesPerView: 5,
        spaceBetween: 50,
      },
    }
  });