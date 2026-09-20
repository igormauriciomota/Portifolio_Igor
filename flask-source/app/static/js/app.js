// Espera o HTML terminar de carregar antes de procurar elementos da página.
document.addEventListener("DOMContentLoaded", () => {
  const sections = [...document.querySelectorAll("main section[id]")];
  const menuLinks = [
    ...document.querySelectorAll(".portfolio-sidebar nav a"),
  ];

  // IntersectionObserver informa quais seções entraram ou saíram da tela.
  // Ele é mais eficiente que executar uma função a cada pixel de scroll.
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => {
          return second.intersectionRatio - first.intersectionRatio;
        })[0];

      if (!visibleSection) {
        return;
      }

      // O menu recebe a classe active quando seu href aponta para a seção atual.
      menuLinks.forEach((link) => {
        const isCurrent =
          link.getAttribute("href") === `#${visibleSection.target.id}`;
        link.classList.toggle("active", isCurrent);
      });
    },
    {
      rootMargin: "-28% 0px -55%",
      threshold: [0.1, 0.35, 0.6],
    },
  );

  sections.forEach((section) => sectionObserver.observe(section));

  // Os botões apenas movimentam o container; os projetos vieram do SQLite.
  const projectRail = document.querySelector(".project-rail");
  const previousButton = document.querySelector("[data-rail='prev']");
  const nextButton = document.querySelector("[data-rail='next']");

  previousButton?.addEventListener("click", () => {
    projectRail?.scrollBy({ left: -400, behavior: "smooth" });
  });

  nextButton?.addEventListener("click", () => {
    projectRail?.scrollBy({ left: 400, behavior: "smooth" });
  });
});
