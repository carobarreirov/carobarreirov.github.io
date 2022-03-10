var swiper = new Swiper(".mySwiper", {
    slidesPerView: 5,
    centeredSlides: true,
    loop: true,
    centeredSlides: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
    spaceBetween: 40,
    grabCursor: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });