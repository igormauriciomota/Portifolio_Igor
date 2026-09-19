(() => {
  const root = document.documentElement;
  const stored = localStorage.getItem("theme");
  const preferred = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  root.dataset.bsTheme = stored || preferred;
  document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
    const next = root.dataset.bsTheme === "dark" ? "light" : "dark";
    root.dataset.bsTheme = next;
    localStorage.setItem("theme", next);
  });

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveal = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add("is-visible"); reveal.unobserve(entry.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((element) => reveal.observe(element));

  const counters = document.querySelectorAll("[data-counter]");
  const countObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const target = Number(entry.target.dataset.counter);
    if (reduceMotion) { entry.target.textContent = target + (target === 100 ? "%" : "+"); return; }
    const start = performance.now();
    const tick = (now) => { const progress = Math.min((now - start) / 900, 1); entry.target.textContent = Math.floor(target * progress) + (target === 100 ? "%" : "+"); if (progress < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick); countObserver.unobserve(entry.target);
  }));
  counters.forEach((counter) => countObserver.observe(counter));

  document.querySelectorAll("form[data-confirm]").forEach((form) => form.addEventListener("submit", (event) => {
    if (!window.confirm(form.dataset.confirm)) event.preventDefault();
  }));

  const heroCard = document.querySelector("[data-hero-tilt]");
  if (heroCard && !reduceMotion && matchMedia("(pointer:fine)").matches) {
    heroCard.addEventListener("pointermove", (event) => {
      const rect = heroCard.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      heroCard.style.setProperty("--card-y", `${x * 5}deg`);
      heroCard.style.setProperty("--card-x", `${-y * 3}deg`);
    });
    heroCard.addEventListener("pointerleave", () => {
      heroCard.style.setProperty("--card-y", "0deg");
      heroCard.style.setProperty("--card-x", "0deg");
    });
  }

  const canvas = document.querySelector("#data-space");
  if (!canvas || reduceMotion) return;
  const context = canvas.getContext("2d");
  let points = [];
  const resize = () => {
    const ratio = Math.min(devicePixelRatio, 2);
    canvas.width = innerWidth * ratio; canvas.height = innerHeight * ratio;
    canvas.style.width = `${innerWidth}px`; canvas.style.height = `${innerHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    points = Array.from({ length: Math.min(65, Math.floor(innerWidth / 20)) }, () => ({ x:(Math.random()-.5)*900, y:(Math.random()-.5)*600, z:Math.random()*700+100, speed:Math.random()*.45+.12 }));
  };
  const draw = () => {
    context.clearRect(0, 0, innerWidth, innerHeight); const projected=[];
    for (const p of points) { p.z-=p.speed; if(p.z<60)p.z=800; const scale=460/p.z; const x=innerWidth*.5+p.x*scale; const y=innerHeight*.5+p.y*scale; projected.push({x,y,scale}); context.fillStyle=`rgba(68,200,255,${Math.min(scale*.55,.55)})`; context.beginPath(); context.arc(x,y,Math.max(1,scale*1.8),0,Math.PI*2); context.fill(); }
    for(let i=0;i<projected.length;i++)for(let j=i+1;j<projected.length;j++){const a=projected[i],b=projected[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<105){context.strokeStyle=`rgba(68,200,255,${(1-d/105)*.12})`;context.beginPath();context.moveTo(a.x,a.y);context.lineTo(b.x,b.y);context.stroke();}}
    requestAnimationFrame(draw);
  };
  resize(); addEventListener("resize", resize, { passive:true }); draw();
})();
