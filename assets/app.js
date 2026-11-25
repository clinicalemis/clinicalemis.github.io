(() => {
  "use strict";

  // Eventos de conversão: compatível com GA4 (gtag) e Google Tag Manager (dataLayer)
  window.dataLayer = window.dataLayer || [];
  const track = (name, label) => {
    const params = { event_category: "conversao", event_label: label || "" };
    window.dataLayer.push({ event: name, ...params });
    if (typeof window.gtag === "function") window.gtag("event", name, params);
  };
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-track]");
    if (el) track(el.dataset.track, el.dataset.label);
  });

  // Filtro de especialidades
  const lista = document.getElementById("lista");
  if (!lista) return;
  const itens = [...lista.querySelectorAll(".svc")];
  const tabs = [...document.querySelectorAll(".tab")];
  const q = document.getElementById("q");
  const vazio = document.getElementById("vazio");
  const status = document.getElementById("status");
  const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  const textos = itens.map((li) => norm(li.textContent));
  let cat = "todas";

  const aplicar = () => {
    const termo = norm(q.value.slice(0, 40));
    let n = 0;
    itens.forEach((li, i) => {
      const ok = (cat === "todas" || li.dataset.cat === cat) && (!termo || textos[i].includes(termo));
      li.hidden = !ok;
      if (ok) n++;
    });
    vazio.hidden = n > 0;
    status.textContent = n === 1 ? "1 serviço" : n + " serviços";
  };

  const setCat = (c) => {
    cat = c;
    tabs.forEach((t) => t.setAttribute("aria-pressed", String(t.dataset.cat === c)));
    aplicar();
  };

  tabs.forEach((t) => t.addEventListener("click", () => setCat(t.dataset.cat)));
  q.addEventListener("input", aplicar);

  document.querySelectorAll("[data-goto]").forEach((b) =>
    b.addEventListener("click", () => {
      q.value = "";
      setCat(b.dataset.goto);
      document.getElementById("especialidades").scrollIntoView({ block: "start" });
    })
  );

  const ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();
})();
