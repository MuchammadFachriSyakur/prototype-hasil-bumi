const heroTranslations = {
  id: {
    title: "Katalog Perusahaan",
    desc: "Mengenal lebih dekat profil, visi, dan keunggulan kami dalam menyediakan produk terbaik dari alam Indonesia.",
  },
  en: {
    title: "Company Catalog",
    desc: "Get to know our profile, vision, and excellence in providing the best products from Indonesia's nature.",
  },
};

async function applyTranslations(lang = "id") {
  try {
    const response = await fetch("data/translations.json");
    const dataJSON = await response.json();
    const data = dataJSON[lang].about;

    document.getElementById("tentang-kami").innerText = data.title;
    document.getElementById("tentang-kami-subtitle").innerText = data.desc;

    document.getElementById(
      "title-visi-misi"
    ).innerText = `${data.visi} & ${data.misi}`;
    document.getElementById("title-visi").innerText = data.visi;
    document.getElementById("title-misi").innerText = data.misi;

    const visiP = document.querySelector(".card:nth-child(1) p");
    visiP.innerText = data.visi_desc;

    const misiList = document.querySelector(".card:nth-child(2) ul");
    misiList.innerHTML = "";
    data.misi_list.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      misiList.appendChild(li);
    });

    const whyTitle = document.querySelector("section:nth-of-type(3) h2");
    const whyContainer = document.querySelector(".why");
    whyTitle.innerText = data.why_title;

    whyContainer.innerHTML = "";
    data.why.forEach((item) => {
      const div = document.createElement("div");
      div.classList.add("why-item");
      div.innerHTML = `
        <h4>${item.title}</h4>
        <p>${item.desc}</p>
      `;
      whyContainer.appendChild(div);
    });
  } catch (err) {
    console.error("Gagal memuat translasi:", err);
  }
}

const savedLang = localStorage.getItem("lang") || "id";
document.getElementById("hero-title").innerText =
  heroTranslations[savedLang].title;
document.getElementById("hero-desc").innerText =
  heroTranslations[savedLang].desc;
applyTranslations(savedLang);
