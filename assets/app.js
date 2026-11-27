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

  // Mapa sob demanda: o iframe do Google só carrega quando a pessoa pede
  const mapBtn = document.querySelector(".map-load");
  if (mapBtn) {
    mapBtn.addEventListener("click", () => {
      const f = document.createElement("iframe");
      f.src = mapBtn.dataset.src;
      f.title = "Mapa da Clínica Lemis na Rua Manoel Ramiro, Centro de Tucano-BA";
      f.referrerPolicy = "no-referrer-when-downgrade";
      f.setAttribute("allowfullscreen", "");
      mapBtn.replaceWith(f);
    }, { once: true });
  }

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

  const ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();
})();
