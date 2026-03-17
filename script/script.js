const nav = document.getElementById("nav");
const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");

window.addEventListener("scroll", () =>
  nav.classList.toggle("scrolled", window.scrollY > 40)
);
hamburger.addEventListener("click", () => {
  nav.classList.toggle("open");
});

const counters = document.querySelectorAll("[data-counter]");
const observerCounters = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.getAttribute("data-counter");
        let cur = 0;
        const step = Math.ceil(target / 60);
        const int = setInterval(() => {
          cur += step;
          if (cur >= target) {
            cur = target;
            clearInterval(int);
          }
          el.textContent = cur.toLocaleString();
        }, 20);
        observerCounters.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);
counters.forEach((c) => observerCounters.observe(c));

const observerProgress = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const item = entry.target;
        const bar = item.querySelector(".bar span");
        const num = item.querySelector("[data-target]");

        const target = parseFloat(bar.dataset.bar);
        if (!isNaN(target)) {
          bar.style.width = target + "%";
        }

        if (num) {
          let cur = 0;
          const step = Math.ceil(target / 50);
          const int = setInterval(() => {
            cur += step;
            if (cur >= target) {
              cur = target;
              clearInterval(int);
            }
            num.textContent = cur + "%";
          }, 20);
        }

        observerProgress.unobserve(item);
      }
    });
  },
  { threshold: 0.4 }
);

document.addEventListener("click", (e) => {
  if (e.target.matches(".faq-q")) {
    e.target.parentElement.classList.toggle("active");
  }
});

const form = document.getElementById("contactForm");
const toast = document.getElementById("toast");

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;
  const waNumber = translations[currentLang].kontak.wa1.replace(/\D/g, "");
  
  let waMsg = translations[currentLang].wa_message
    .replace("{name}", name)
    .replace("{email}", email)
    .replace("{message}", message);
  
  const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMsg.replace(/\\n/g, "\n"))}`;
  window.open(url, "_blank");
  
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4000);
  form.reset();
});

const floatingWA = document.getElementById("floatingWA");
if (floatingWA) {
  window.addEventListener("scroll", () => {
    floatingWA.classList.toggle("show", window.scrollY > 300);
  });
}

let currentLang = localStorage.getItem("lang") || "id";
let translations = {};
let products = [];

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("data/translations.json");
    translations = await res.json();
  } catch (err) {
    console.error("Gagal memuat translations.json:", err);
  }

  try {
    const res = await fetch("data/products.json");
    products = await res.json();
  } catch (err) {
    console.error("Gagal memuat produk:", err);
  }

  renderAll();

  document.getElementById("langSwitcher")?.addEventListener("click", () => {
    currentLang = currentLang === "id" ? "en" : "id";
    document.documentElement.lang = currentLang;
    localStorage.setItem("lang", currentLang);
    renderAll();
  });

  renderAll();
});

function renderAll() {
  renderText(translations, currentLang);
  renderMisi();
  renderWhy();
  renderTimeline();
  renderProgress();
  renderFAQ();
  renderKontak();
  renderMutu();
  renderProducts(products);
  updateFloatingWA();
}

function renderText(data, lang) {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const rawKey = el.dataset.i18n;

    if (rawKey.startsWith("[placeholder]")) {
      const key = rawKey.replace("[placeholder]", "").trim();
      const keys = key.split(".");
      let value = data?.[lang];
      for (const k of keys) value = value?.[k];

      if (value !== undefined) {
        el.setAttribute("placeholder", value);
      } else {
        el.setAttribute("placeholder", `[${key} not found]`);
      }
    } else {
      const keys = rawKey.split(".");
      let value = data?.[lang];
      for (const k of keys) value = value?.[k];

      if (value !== undefined) {
        el.textContent = value;
      } else {
        el.textContent = `[${rawKey} not found]`;
      }
    }
  });

  const langBtn = document.getElementById("langSwitcher");
  if (langBtn) {
    const img = langBtn.querySelector("img");
    img.src =
      currentLang === "id"
        ? "https://flagcdn.com/w20/gb.png"
        : "https://flagcdn.com/w20/id.png";
  }
}

function renderMisi() {
  const list = translations[currentLang]?.about?.misi_list || [];
  const el = document.getElementById("misiList");
  if (!el) return;
  el.innerHTML = "";
  list.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    el.appendChild(li);
  });
}

function renderWhy() {
  const items = translations[currentLang]?.about?.why || [];
  const wrap = document.getElementById("whyWrap");
  if (!wrap) return;
  wrap.innerHTML = "";
  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "why-item";
    div.innerHTML = `<h4>${item.title}</h4><p>${item.desc}</p>`;
    wrap.appendChild(div);
  });
}

function renderProducts(products) {
  const container = document.getElementById("productGrid");
  if (!container) return;
  container.innerHTML = "";
  products.forEach((p) => {
    const item = document.createElement("div");
    item.className = "product-item";
    item.innerHTML = `
  <a href="detail-produk.html?id=${p.id}" style="text-decoration:none; color:inherit;">
  <img src="${p.image}" alt="${p.name[currentLang]}" />
  <div class="info">
    <h3>${p.name[currentLang]}</h3>
    <p>${p.shortDesc[currentLang]}</p>
  </div>
</a>
`;

    container.appendChild(item);
  });
}

function renderTimeline() {
  const steps = translations[currentLang]?.proses?.steps || [];
  const container = document.getElementById("timeline");
  if (!container) return;
  container.innerHTML = steps
    .map(
      (step, i) => `
    <div class="step" data-step="${i + 1}">
      <div class="num">${step.title}</div>
      <div class="text">${step.desc}</div>
    </div>`
    )
    .join("");
}

function renderMutu() {
  const mutuTitle = translations[currentLang]?.proses?.mutu;
  const mutuItems = translations[currentLang]?.proses?.mutu_items || [];

  const titleEl = document.getElementById("mutuTitle");
  const container = document.getElementById("mutuContent");

  if (titleEl) titleEl.textContent = mutuTitle;
  if (!container) return;

  container.innerHTML = mutuItems
    .map(
      (item) => `
        <div class="progress">
          <div class="progress-title">
            <span>${item.label}</span>
            <span><b data-target="${item.value}">0</b></span>
          </div>
          <div class="bar"><span data-bar="${item.value}"></span></div>
        </div>
      `
    )
    .join("");

  const progressItems = document.querySelectorAll("#mutuContent .progress");
  progressItems.forEach((item) => {
    observerProgress.observe(item);
  });
}

function renderProgress() {
  const bars = translations[currentLang]?.proses?.progress || [];
  const container = document.getElementById("progressWrap");
  if (!container) return;
  container.innerHTML = bars
    .map(
      (b) => `
    <div class="progress-item">
      <div class="progress-title">
        <span>${b.label}</span>
        <b data-target="${b.value}">0</b>
      </div>
      <div class="progress-bar">
        <div class="bar" data-bar="${b.value}"></div>
      </div>
    </div>`
    )
    .join("");
}

function renderFAQ() {
  const faqs = translations[currentLang]?.faq?.items || [];
  const container = document.getElementById("faqContent");
  if (!container) return;
  container.innerHTML = faqs
    .map(
      (f) => `
    <div class="faq-item">
      <div class="faq-q">${f.q}</div>
      <div class="faq-a">${f.a}</div>
    </div>`
    )
    .join("");
}

function renderKontak() {
  const kontak = translations[currentLang]?.kontak;
  const container = document.getElementById("kontakContent");
  if (!container || !kontak) return;

  container.innerHTML = `
    <div class="kontak-layout">
  <div class="kontak-intro">
    <h3>${kontak.name}</h3>
    <p>${kontak.address}</p>
    <p><a href="mailto:${kontak.email}">${kontak.email}</a></p>
    <p>${kontak.contact}</p>
  </div>
  <div class="kontak-boxes">
    <div class="kontak-box">
      <img src="image/wa.jpg" alt="WhatsApp" />
      <a href="https://wa.me/${kontak.wa1.replace(/\D/g, "")}">${kontak.wa1}</a>
    </div>
    <div class="kontak-box">
      <img src="image/web.svg" alt="Website" />
      <a href="mailto:${kontak.email}">${kontak.email}</a>
    </div>
  </div>
</div>
  `;
}

function updateFloatingWA() {
  const floatingWA = document.getElementById("floatingWA");
  if (!floatingWA || !translations[currentLang]) return;
  const waNumber = translations[currentLang].kontak.wa1.replace(/\D/g, "");
  floatingWA.href = `https://wa.me/${waNumber}`;
}
