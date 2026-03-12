// detail.js - Detail logic for Rempah Nusantara

let currentLang = sessionStorage.getItem("lang") || "id";
let products = [];

// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

document.addEventListener("DOMContentLoaded", async () => {
  // Set initial language from session
  document.documentElement.lang = currentLang;

  try {
    const res = await fetch("data/products.json");
    products = await res.json();
    updateUI();
  } catch (err) {
    console.error("Gagal load produk:", err);
    const container = document.getElementById("productDetail");
    if (container) {
      container.innerHTML = "<p>Produk tidak ditemukan.</p>";
    }
  }

  // Language switcher event
  const langSwitcher = document.getElementById("langSwitcher");
  if (langSwitcher) {
    langSwitcher.addEventListener("click", () => {
      currentLang = currentLang === "id" ? "en" : "id";
      document.documentElement.lang = currentLang;
      sessionStorage.setItem("lang", currentLang);
      updateUI();
    });
  }
});

/**
 * Main function to update all UI elements based on current product and language
 */
function updateUI() {
  renderDetail();
  updateLangIcon();
  updatePageTitle();
}

/**
 * Render product details and update "Order Now" button
 */
function renderDetail() {
  const container = document.getElementById("productDetail");
  const product = products.find((p) => p.id === productId);

  if (!product) {
    container.innerHTML = "<p>Produk tidak ditemukan.</p>";
    return;
  }

  container.innerHTML = `
    <img src="${product.image}" alt="${product.name[currentLang]}" />
    <div class="product-info">
      <h1>${product.name[currentLang]}</h1>
      <p>${product.desc[currentLang]}</p>
    </div>
  `;

  // Update link "Pesan Sekarang" / "Order Now"
  const orderBtn = document.getElementById("orderBtn");
  if (orderBtn) {
    const translations = {
      id: {
        btn: "Pesan Sekarang",
        msg: "Halo, saya tertarik dengan produk ini: "
      },
      en: {
        btn: "Order Now",
        msg: "Hi, I'm interested in this product: "
      }
    };

    const t = translations[currentLang];
    orderBtn.textContent = t.btn;

    const message = `${t.msg} ${product.name[currentLang]}`;
    const waLink = `https://wa.me/6285230017377?text=${encodeURIComponent(message)}`;

    orderBtn.setAttribute("href", waLink);
    orderBtn.setAttribute("target", "_blank");
  }
}

/**
 * Update the language switcher icon (shows the flag of the language you will SWITCH TO)
 */
function updateLangIcon() {
  const langBtn = document.getElementById("langSwitcher");
  if (!langBtn) return;

  const img = langBtn.querySelector("img");
  if (img) {
    // If current is ID, show GB flag (to switch to EN)
    img.src = currentLang === "id"
      ? "https://flagcdn.com/w20/gb.png"
      : "https://flagcdn.com/w20/id.png";
  }
}


/**
 * Update page title according to language
 */
function updatePageTitle() {
  const detailTitle = currentLang === 'id'
    ? "Detail Produk | Rempah Nusantara"
    : "Product Detail | Rempah Nusantara";
  document.title = detailTitle;
}
