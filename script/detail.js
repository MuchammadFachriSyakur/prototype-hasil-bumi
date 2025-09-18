// Ambil bahasa dari sessionStorage, default "id"
let currentLang = sessionStorage.getItem("lang") || "id";
document.documentElement.lang = currentLang;

let products = [];

// Ambil parameter ID dari URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("data/products.json");
    products = await res.json();
    renderDetail();
  } catch (err) {
    console.error("Gagal load produk:", err);
    document.getElementById("productDetail").innerHTML =
      "<p>Produk tidak ditemukan.</p>";
  }

  // Switch bahasa
  document.getElementById("langSwitcher")?.addEventListener("click", () => {
    currentLang = currentLang === "id" ? "en" : "id";
    document.documentElement.lang = currentLang;
    sessionStorage.setItem("lang", currentLang); // simpan ke session
    renderDetail();
    updateLangIcon();
  });

  updateLangIcon();
});

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

  // Update link "Pesan Sekarang"
  const orderBtn = document.getElementById("orderBtn");
  if (orderBtn) {
    let message = "";
    if (currentLang === "id") {
      message = `Halo, saya tertarik dengan produk ini: ${product.name[currentLang]}`;
    } else {
      message = `Hi, I'm interested in this product: ${product.name[currentLang]}`;
    }

    const waLink = `https://wa.me/6285230017377?text=${encodeURIComponent(
      message
    )}`;
    orderBtn.setAttribute("href", waLink);
    orderBtn.setAttribute("target", "_blank"); // buka di tab baru
  }
}

function updateLangIcon() {
  const langBtn = document.getElementById("langSwitcher");
  const img = langBtn.querySelector("img");
  // Kalau bahasa "id", tampilkan flag Inggris sebagai tombol switch
  img.src =
    currentLang === "id"
      ? "https://flagcdn.com/w20/gb.png"
      : "https://flagcdn.com/w20/id.png";
}

