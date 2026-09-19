(() => {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const modules = [...document.querySelectorAll(".tech-module")];
  const title = document.querySelector("[data-tech-title]");
  const description = document.querySelector("[data-tech-description]");

  const selectModule = (selected) => {
    modules.forEach((module) => {
      const active = module === selected;
      module.classList.toggle("is-active", active);
      module.setAttribute("aria-selected", String(active));
    });
    title.textContent = selected.dataset.title;
    description.textContent = selected.dataset.description;
  };

  modules.forEach((module) => {
    module.addEventListener("click", () => selectModule(module));
    module.addEventListener("mouseenter", () => selectModule(module));
    module.addEventListener("focus", () => selectModule(module));
    module.addEventListener("keydown", (event) => {
      if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(event.key)) return;
      event.preventDefault();
      const direction = ["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1;
      const next = modules[(modules.indexOf(module) + direction + modules.length) % modules.length];
      next.focus();
      selectModule(next);
    });
  });

  const stage = document.querySelector("[data-tilt]");
  if (stage && !reduceMotion && matchMedia("(pointer:fine)").matches) {
    stage.addEventListener("pointermove", (event) => {
      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      stage.style.setProperty("--tilt-y", `${x * 4}deg`);
      stage.style.setProperty("--tilt-x", `${-y * 2.4}deg`);
    });
    stage.addEventListener("pointerleave", () => {
      stage.style.setProperty("--tilt-y", "0deg");
      stage.style.setProperty("--tilt-x", "0deg");
    });
  }

  const canvas = document.querySelector("#future-particles");
  if (!canvas || reduceMotion) return;
  const context = canvas.getContext("2d");
  let particles = [];

  const resize = () => {
    const ratio = Math.min(devicePixelRatio, 2);
    canvas.width = innerWidth * ratio;
    canvas.height = innerHeight * ratio;
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    particles = Array.from({ length: Math.min(85, Math.floor(innerWidth / 15)) }, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      size: Math.random() * 1.2 + .3,
      speed: Math.random() * .28 + .08,
      opacity: Math.random() * .5 + .12
    }));
  };

  const draw = () => {
    context.clearRect(0, 0, innerWidth, innerHeight);
    particles.forEach((particle) => {
      particle.y -= particle.speed;
      if (particle.y < -4) {
        particle.y = innerHeight + 4;
        particle.x = Math.random() * innerWidth;
      }
      context.fillStyle = `rgba(103,232,255,${particle.opacity})`;
      context.fillRect(particle.x, particle.y, particle.size, particle.size * 3);
    });
    requestAnimationFrame(draw);
  };

  resize();
  addEventListener("resize", resize, { passive: true });
  draw();
})();
