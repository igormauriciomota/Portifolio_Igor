(() => {
  "use strict";

  const ready = (callback) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  };

  ready(() => {
    const sections = [...document.querySelectorAll(".content section[id]")];
    const menuLinks = [...document.querySelectorAll(".side-nav a")];

    if ("IntersectionObserver" in window && sections.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];
          if (!visible) return;
          menuLinks.forEach((link) => {
            link.classList.toggle("active", link.hash === "#" + visible.target.id);
          });
        },
        { rootMargin: "-28% 0px -55%", threshold: [0.1, 0.35, 0.6] },
      );
      sections.forEach((section) => observer.observe(section));
    }

    const rail = document.querySelector(".project-rail");
    document.querySelector("[data-rail='prev']")?.addEventListener("click", () => {
      rail?.scrollBy({ left: -410, behavior: "smooth" });
    });
    document.querySelector("[data-rail='next']")?.addEventListener("click", () => {
      rail?.scrollBy({ left: 410, behavior: "smooth" });
    });

    setupHologram();
    setupProjectExplorer();
    setupConfirmations();
    setupGitHubRefresh();
  });

  function setupHologram() {
    const dialog = document.querySelector("[data-hologram-dialog]");
    if (!(dialog instanceof HTMLDialogElement)) return;

    const opener = document.querySelector("[data-hologram-open]");
    const stage = dialog.querySelector("[data-hologram-stage]");
    const modules = [...dialog.querySelectorAll("[data-hologram-module]")];
    const readoutTitle = dialog.querySelector("[data-hologram-title]");
    const readoutDescription = dialog.querySelector("[data-hologram-description]");
    const readoutLink = dialog.querySelector("[data-hologram-link]");

    const close = () => {
      if (dialog.open) dialog.close();
    };

    opener?.addEventListener("click", () => dialog.showModal());
    dialog.querySelectorAll("[data-hologram-close]").forEach((button) => button.addEventListener("click", close));
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) close();
    });

    const selectModule = (button) => {
      modules.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("is-active", selected);
        item.setAttribute("aria-selected", String(selected));
      });
      if (readoutTitle) readoutTitle.textContent = button.dataset.title || "Tecnologia";
      if (readoutDescription) readoutDescription.textContent = button.dataset.description || "";
      if (readoutLink instanceof HTMLAnchorElement) readoutLink.href = button.dataset.href || "#";
    };

    modules.forEach((button, index) => {
      button.addEventListener("pointerenter", () => selectModule(button));
      button.addEventListener("focus", () => selectModule(button));
      button.addEventListener("click", () => {
        const destination = button.dataset.href;
        if (destination) window.location.assign(destination);
      });
      button.addEventListener("keydown", (event) => {
        if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(event.key)) return;
        event.preventDefault();
        const direction = ["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1;
        const next = (index + direction + modules.length) % modules.length;
        modules[next].focus();
      });
    });

    if (stage && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      stage.addEventListener("pointermove", (event) => {
        if (event.pointerType === "touch") return;
        const rect = stage.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        stage.style.setProperty("--holo-tilt-y", String(x * 5) + "deg");
        stage.style.setProperty("--holo-tilt-x", String(-y * 3) + "deg");
      });
      stage.addEventListener("pointerleave", () => {
        stage.style.setProperty("--holo-tilt-y", "0deg");
        stage.style.setProperty("--holo-tilt-x", "0deg");
      });
    }
  }

  function setupProjectExplorer() {
    const explorer = document.querySelector("[data-project-explorer]");
    if (!explorer) return;

    const buttons = [...explorer.querySelectorAll("[data-project-filter]")];
    const cards = [...explorer.querySelectorAll("[data-project-card]")];
    const search = explorer.querySelector("[data-project-search]");
    const empty = explorer.querySelector("[data-project-empty]");
    const reset = explorer.querySelector("[data-project-reset]");
    const allowed = buttons.map((button) => button.dataset.projectFilter);
    const requested = explorer.dataset.initialFilter;
    let activeFilter = allowed.includes(requested) ? requested : "Todos";

    const matchFilter = (text, filter) => {
      if (filter === "Todos") return true;
      const patterns = {
        Django: /django/,
        Web: /flask|django|bootstrap|web/,
        APIs: /api|fastapi|rest framework|drf/,
        Dados: /dados|pandas|power bi|sql|analytics|excel/,
        ERP: /erp|finance|estoque|gestão/,
      };
      return (patterns[filter] || new RegExp(filter.toLowerCase())).test(text);
    };

    const refresh = () => {
      const query = search instanceof HTMLInputElement ? search.value.trim().toLocaleLowerCase("pt-BR") : "";
      let visible = 0;
      cards.forEach((card) => {
        const text = (card.dataset.search || "").toLocaleLowerCase("pt-BR");
        const show = matchFilter(text, activeFilter) && (!query || text.includes(query));
        card.hidden = !show;
        if (show) visible += 1;
      });
      buttons.forEach((button) => button.classList.toggle("active", button.dataset.projectFilter === activeFilter));
      if (empty) empty.hidden = visible !== 0;
    };

    buttons.forEach((button) => button.addEventListener("click", () => {
      activeFilter = button.dataset.projectFilter || "Todos";
      refresh();
    }));
    search?.addEventListener("input", refresh);
    reset?.addEventListener("click", () => {
      activeFilter = "Todos";
      if (search instanceof HTMLInputElement) search.value = "";
      refresh();
    });
    refresh();
  }

  function setupConfirmations() {
    document.querySelectorAll("form[data-confirm]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        if (!window.confirm(form.dataset.confirm || "Confirmar operação?")) event.preventDefault();
      });
    });
  }

  function setupGitHubRefresh() {
    const root = document.querySelector("[data-github-progress]");
    if (!root) return;

    const update = async () => {
      try {
        const response = await fetch("/api/github/python-practice-lab", { headers: { Accept: "application/json" } });
        if (!response.ok) return;
        const data = await response.json();
        if (data.source !== "live") return;

        const commitCount = root.querySelector("[data-github-commits]");
        const activeDays = root.querySelector("[data-github-active]");
        const latest = root.querySelector("[data-github-latest]");
        if (commitCount) commitCount.textContent = String(data.commit_count ?? "—");
        if (activeDays) activeDays.textContent = String((data.days || []).filter((day) => day.count > 0).length);
        if (latest) latest.textContent = data.latest_commit_at ? data.latest_commit_at.slice(0, 10) : "—";

        const chart = root.querySelector("[data-github-chart]");
        if (chart && data.days?.length) {
          chart.replaceChildren();
          const maximum = Math.max(1, ...data.days.map((day) => day.count));
          data.days.forEach((day) => {
            const column = document.createElement("span");
            column.classList.toggle("has-commits", day.count > 0);
            column.style.setProperty("--commit-height", String(Math.max(7, (day.count / maximum) * 100)) + "%");
            column.title = day.date + ": " + day.count + " commit(s)";
            column.append(document.createElement("i"));
            chart.append(column);
          });
        }
      } catch {
        // A renderização inicial permanece útil se a API estiver indisponível.
      }
    };

    window.setTimeout(update, 1500);
    window.setInterval(update, 300000);
  }
})();
