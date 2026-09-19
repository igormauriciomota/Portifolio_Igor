(() => {
  const dialog = document.querySelector("#case-dialog");
  if (!dialog) return;

  const fields = {
    title: dialog.querySelector("[data-case-title]"),
    category: dialog.querySelector("[data-case-category]"),
    year: dialog.querySelector("[data-case-year]"),
    status: dialog.querySelector("[data-case-status]"),
    summary: dialog.querySelector("[data-case-summary]"),
    description: dialog.querySelector("[data-case-description]"),
    level: dialog.querySelector("[data-case-level]"),
    stack: dialog.querySelector("[data-case-stack]"),
    link: dialog.querySelector("[data-case-link]")
  };

  document.querySelectorAll("[data-case-open]").forEach((button) => {
    button.addEventListener("click", () => {
      fields.title.textContent = button.dataset.title;
      fields.category.textContent = button.dataset.category;
      fields.year.textContent = button.dataset.year;
      fields.status.textContent = button.dataset.status;
      fields.summary.textContent = button.dataset.summary;
      fields.description.textContent = button.dataset.description;
      fields.level.textContent = `${button.dataset.level} · ${button.dataset.status}`;
      fields.link.href = button.dataset.url;
      fields.stack.replaceChildren(...button.dataset.technologies.split(",").map((technology) => {
        const tag = document.createElement("span");
        tag.textContent = technology.trim();
        return tag;
      }));
      dialog.showModal();
    });
  });

  dialog.querySelector("[data-case-close]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    const inside = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
    if (!inside) dialog.close();
  });

  if (!matchMedia("(prefers-reduced-motion: reduce)").matches && matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll("[data-case-card]").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.setProperty("--case-y", `${x * 3.5}deg`);
        card.style.setProperty("--case-x", `${-y * 2.4}deg`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--case-y", "0deg");
        card.style.setProperty("--case-x", "0deg");
      });
    });
  }
})();
