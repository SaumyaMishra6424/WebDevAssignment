(() => {
  const heroSlideImages = [
    "./assets/hero-6385/b2bbeacab99354ed8115ebeb93ea4f25afce46fb.png",
    "./assets/hero-6385/b2bbeacab99354ed8115ebeb93ea4f25afce46fb.png",
    "./assets/hero-6385/b2bbeacab99354ed8115ebeb93ea4f25afce46fb.png",
    "./assets/hero-6385/b2bbeacab99354ed8115ebeb93ea4f25afce46fb.png",
    "./assets/hero-6385/b2bbeacab99354ed8115ebeb93ea4f25afce46fb.png",
    "./assets/hero-6385/b2bbeacab99354ed8115ebeb93ea4f25afce46fb.png"
  ];

  function throttleByRaf(callback) {
    let ticking = false;
    return (...args) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        callback(...args);
        ticking = false;
      });
    };
  }

  function initStickyHeader() {
    const sticky = document.getElementById("stickyProductBar");
    const hero = document.getElementById("hero");
    if (!sticky || !hero) return;

    let previousY = window.scrollY;

    const onScroll = throttleByRaf(() => {
      const currentY = window.scrollY;
      const threshold = hero.offsetTop + hero.offsetHeight * 0.6;
      const scrollingDown = currentY > previousY;
      const pastFold = currentY > threshold;

      if (pastFold && scrollingDown) {
        sticky.classList.add("is-visible");
        sticky.setAttribute("aria-hidden", "false");
      } else {
        sticky.classList.remove("is-visible");
        sticky.setAttribute("aria-hidden", "true");
      }

      previousY = currentY;
    });

    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function setHeroSlide(index) {
    const main = document.getElementById("heroMainImage");
    const thumbs = document.querySelectorAll(".hero-carousel .thumb");
    if (!(main instanceof HTMLImageElement) || thumbs.length === 0) return;
    const safeIndex = (index + heroSlideImages.length) % heroSlideImages.length;
    main.src = heroSlideImages[safeIndex];
    main.dataset.slideIndex = String(safeIndex);
    thumbs.forEach((thumb, i) => {
      thumb.classList.toggle("is-active", i === safeIndex);
      thumb.setAttribute("aria-selected", i === safeIndex ? "true" : "false");
    });
  }

  function initCarousel() {
    const heroCarousel = document.querySelector(".hero-carousel");
    if (heroCarousel) {
      let current = 0;
      const nextBtn = heroCarousel.querySelector(".js-next");
      const prevBtn = heroCarousel.querySelector(".js-prev");
      const thumbs = heroCarousel.querySelectorAll(".thumb");

      setHeroSlide(current);

      nextBtn?.addEventListener("click", () => {
        current += 1;
        setHeroSlide(current);
      });

      prevBtn?.addEventListener("click", () => {
        current -= 1;
        setHeroSlide(current);
      });

      thumbs.forEach((thumb, index) => {
        thumb.addEventListener("click", () => {
          current = index;
          setHeroSlide(current);
        });
      });

      heroCarousel.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
          current += 1;
          setHeroSlide(current);
        } else if (event.key === "ArrowLeft") {
          current -= 1;
          setHeroSlide(current);
        }
      });
    }

    const sliderOffsets = new Map();
    document.querySelectorAll(".js-slider-next, .js-slider-prev").forEach((button) => {
      button.addEventListener("click", () => {
        const targetId = button.getAttribute("data-target");
        if (!targetId) return;
        const track = document.getElementById(targetId);
        if (!track) return;
        const viewport = track.closest(".slider-viewport");
        const card = track.firstElementChild;
        if (!(viewport instanceof HTMLElement) || !(card instanceof HTMLElement)) return;

        const cardWidth = card.offsetWidth;
        const gap = 12;
        const step = cardWidth + gap;
        const maxOffset = Math.max(0, track.scrollWidth - viewport.clientWidth);
        const previous = sliderOffsets.get(targetId) || 0;
        const direction = button.classList.contains("js-slider-next") ? 1 : -1;
        const next = Math.min(maxOffset, Math.max(0, previous + direction * step));

        sliderOffsets.set(targetId, next);
        track.style.transform = `translate3d(${-next}px, 0, 0)`;
      });
    });
  }

  function initZoomFeature() {
    const target = document.getElementById("heroMainImage");
    if (!(target instanceof HTMLImageElement)) return;

    let rafId = 0;
    let currentX = 50;
    let currentY = 50;

    const updatePosition = () => {
      target.style.transformOrigin = `${currentX}% ${currentY}%`;
      rafId = 0;
    };

    target.addEventListener("mouseenter", () => {
      if (window.matchMedia("(max-width: 1023px)").matches) return;
      target.style.transform = "scale(1.2)";
    });

    target.addEventListener("mouseleave", () => {
      target.style.transform = "scale(1)";
      target.style.transformOrigin = "center center";
    });

    target.addEventListener("mousemove", (event) => {
      if (window.matchMedia("(max-width: 1023px)").matches) return;
      const rect = target.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      currentX = Math.max(0, Math.min(100, x));
      currentY = Math.max(0, Math.min(100, y));

      if (!rafId) {
        rafId = requestAnimationFrame(updatePosition);
      }
    });
  }

  function initFaqAccordion() {
    const items = [...document.querySelectorAll(".accordion-item")];
    items.forEach((item) => {
      const trigger = item.querySelector(".accordion-trigger");
      if (!(trigger instanceof HTMLButtonElement)) return;

      trigger.addEventListener("click", () => {
        const shouldOpen = !item.classList.contains("is-open");
        items.forEach((entry) => {
          const btn = entry.querySelector(".accordion-trigger");
          entry.classList.remove("is-open");
          btn?.setAttribute("aria-expanded", "false");
        });

        if (shouldOpen) {
          item.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  function init() {
    initStickyHeader();
    initCarousel();
    initZoomFeature();
    initFaqAccordion();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
