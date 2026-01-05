document.querySelectorAll(".project-title").forEach(title => {
    title.addEventListener("click", () => {
        const card = title.closest(".project-card");

        document.querySelectorAll(".project-card").forEach(c => {
            if (c !== card) c.classList.remove("active");
        });

        card.classList.toggle("active");
    });
});
document.addEventListener("DOMContentLoaded", () => {
  const animated = document.querySelectorAll("[data-animate]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -80px 0px"
    }
  );

  animated.forEach(el => observer.observe(el));
});

