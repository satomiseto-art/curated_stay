const elYear = document.getElementById("year");
if (elYear) elYear.textContent = new Date().getFullYear();

// ------------------------------
// Menu drawer toggle
// ------------------------------
const navToggle = document.querySelector(".nav-toggle");
const navDrawer = document.getElementById("navDrawer");
const navDrawerClose = document.querySelector(".nav-drawer__close");
const body = document.body;

function setNavExpanded(expanded) {
  if (!navToggle || !navDrawer) return;
  navToggle.setAttribute("aria-expanded", String(expanded));
  navToggle.setAttribute("aria-label", expanded ? "Close menu" : "Open menu");
  navDrawer.setAttribute("aria-hidden", String(!expanded));
  if (expanded) {
    navDrawer.removeAttribute("inert");
  } else {
    navDrawer.setAttribute("inert", "");
  }
  body.classList.toggle("nav-open", expanded);
}

navToggle?.addEventListener("click", () => {
  const expanded = navToggle.getAttribute("aria-expanded") === "true";
  setNavExpanded(!expanded);
});

navDrawerClose?.addEventListener("click", () => setNavExpanded(false));

navDrawer?.addEventListener("click", (e) => {
  if (e.target === navDrawer) setNavExpanded(false);
});

navDrawer?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setNavExpanded(false));
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navToggle?.getAttribute("aria-expanded") === "true") {
    setNavExpanded(false);
  }
});

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", () => {
    if (navToggle?.getAttribute("aria-expanded") === "true") setNavExpanded(false);
  });
});

// ------------------------------
// Reveal on scroll (Intersection Observer)
// ------------------------------
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
);

function resetReveal(el) {
  if (!el) return;
  el.classList.remove("reveal", "is-visible");
  revealObserver.unobserve(el);
}

function registerReveal(el, delaySec = 0) {
  if (!el) return;
  resetReveal(el);
  el.classList.add("reveal");
  el.style.setProperty("--reveal-delay", `${delaySec}s`);
  if (prefersReducedMotion) {
    el.classList.add("is-visible");
    return;
  }
  revealObserver.observe(el);
  requestAnimationFrame(() => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > window.innerHeight * 0.05) {
      el.classList.add("is-visible");
      revealObserver.unobserve(el);
    }
  });
}

function registerRevealAll(selector, staggerSec = 0.09, maxDelay = 0.72) {
  document.querySelectorAll(selector).forEach((el, index) => {
    registerReveal(el, Math.min(index * staggerSec, maxDelay));
  });
}

registerReveal(document.querySelector(".philosophy .intro-cards-head"));
registerRevealAll(".philosophy .intro-card");
registerReveal(document.querySelector(".iconic-stays-section .iconic-stays-head"));
registerRevealAll(".iconic-stays-section .iconic-stay-card");
registerReveal(document.querySelector(".map-interaction-section .map-tabs"));
registerReveal(document.querySelector(".map-interaction-section .map-body"));
registerRevealAll("#themesPanel .theme-tab-grid");
registerRevealAll("#themeStaysPanel .stay-list-section", 0.08, 0.4);
registerRevealAll("#themeStaysPanel .stay-list-card", 0.06, 0.48);
registerReveal(document.querySelector(".gallery-section .gallery-head"));
registerReveal(document.querySelector(".story-section .story-head"));
registerRevealAll(".story-section .story-card");
registerReveal(document.querySelector(".story-section .story-footer"));
registerReveal(document.querySelector(".reviews-section .reviews-head"));
registerRevealAll(".reviews-section .review-card");
registerReveal(document.querySelector(".cta .cta-inner"));
registerReveal(document.querySelector("footer .footer-inner"));

window.registerMapStayReveals = function (root) {
  if (!root) return;
  resetReveal(root);
  root.querySelectorAll(".map-stay-card").forEach(resetReveal);
  registerReveal(root, 0);
  root.querySelectorAll(".map-stay-card").forEach((card, index) => {
    registerReveal(card, Math.min(0.08 + index * 0.05, 0.56));
  });
};
// ------------------------------
// Japan map interactive stays
// ------------------------------
const AREA_INFO = {
  hokkaido: {
    region: "Hokkaido",
    title: "Hokkaido",
    desc: "Japan's vast northern frontier, where untamed wilderness meets quiet refinement. A land shaped by long winters and extraordinary nature — offering a rare stillness that invites genuine restoration.",
    tags: ["Sapporo", "Niseko", "Furano"],
    image:
      "https://images.microcms-assets.io/assets/a061b71b7a084ccfa781f19d8659cbbd/909ed712f1444a9cbc7da1eaef75db5e/itinerary-long13_PCKV01.jpg",
  },
  tohoku: {
    region: "Tohoku Region",
    title: "Northern Japan",
    desc: "A region of deep forests, ancient hot springs, and sacred mountains still untouched by mass tourism. Tohoku preserves a raw, unhurried version of Japan — where tradition endures not as performance, but as everyday life.",
    tags: ["Aomori", "Hirosaki", "Towada"],
    image:
      "https://images.microcms-assets.io/assets/a061b71b7a084ccfa781f19d8659cbbd/c6eb34aeead24a33ba26af5c02ba8c74/itinerary-long13_SPKV01.jpg",
  },
  kanto: {
    region: "Kanto Region",
    title: "Tokyo & Around",
    desc: "Beyond the luminous skyline of Tokyo lies a quieter Japan — mountain villages, sacred trails, and centuries-old sake breweries. A rare duality: world-class urban culture alongside profound rural solitude, all within reach.",
    tags: ["Tokyo", "Kamakura", "Okutama", "Other places"],
    image: "./image/AdobeStock_704320852.jpeg",
  },
  chubu: {
    region: "Chubu Region",
    title: "Mt. Fuji, Hakone & Beyond",
    desc: "From the iconic silhouette of Fuji to the lacquerware ateliers of Hida Takayama, Chubu is a region of extraordinary contrasts. Private onsen villas overlook ancient crater lakes; mountain ryokan serve kaiseki composed entirely from local harvest.",
    tags: ["Mt. Fuji & Around", "Hakone", "Hida Takayama", "Matsumoto", "Kiso"],
    image:
      "https://images.microcms-assets.io/assets/a061b71b7a084ccfa781f19d8659cbbd/d58a3b53393d4bd2bd77f4e8d5577c24/fujiseiran-ashinoko-numazu_PCKV.jpg",
  },
  kansai: {
    region: "Kansai Region",
    title: "Kyoto, Osaka & Around",
    desc: "The spiritual and aesthetic heart of Japan. Kyoto's machiya townhouses and centuries-old ryokan offer an intimacy with tradition rarely found elsewhere — where a single tea ceremony or an evening with a geisha can quietly reframe how you understand beauty.",
    tags: ["Kyoto", "Osaka", "Nara", "Other places"],
    image:
      "https://images.microcms-assets.io/assets/a061b71b7a084ccfa781f19d8659cbbd/43bc0fc75c11474a8edb9375fb91d94f/hiiragiya-geisha_PCKV.jpg",
  },
  chugoku_shikoku: {
    region: "Chugoku & Shikoku",
    title: "Hiroshima & the Inland Sea",
    desc: "A constellation of islands, historic merchant towns, and world-class contemporary art. The Seto Inland Sea rewards the unhurried traveller — with private villas by architectural masters and ryokan that have stood for generations.",
    tags: ["Hiroshima", "Onomichi", "Kurashiki", "Naoshima & Islands"],
    image:
      "https://images.microcms-assets.io/assets/a061b71b7a084ccfa781f19d8659cbbd/8486dd3ca4aa463cbd8858f061047f82/ryokankurashiki_PCKV.jpg",
  },
  kyushu: {
    region: "Kyushu",
    title: "Kyushu",
    desc: "Japan's southernmost main island pulses with volcanic energy and ancient craftsmanship. From the ceramic villages of Arita to the sacred sites of Nagasaki, Kyushu holds a distinct cultural identity — warmer, wilder, and deeply its own.",
    tags: ["Fukuoka", "Nagasaki", "Kumamoto", "Kagoshima"],
    image:
      "https://images.microcms-assets.io/assets/a061b71b7a084ccfa781f19d8659cbbd/ecf6469354d94fa79c041647e1ffc89f/wataya_PCKV%20(8).jpg",
  },
};

const MAP_STAYS = {
  hokkaido: [],
  tohoku: [
    {
      name: "Aomori — Hirosaki and Towada Journey",
      location: "Aomori",
      url: "https://wabunka-lux.jp/itineraries/long_aomori",
      image: "./image/en_oyashikistay_PCKV.jpg",
    },
  ],
  kanto: [
    {
      name: "Oyashiki Stay — Shodoshima Private Villa",
      location: "Tokyo",
      url: "https://wabunka-lux.jp/experiences/en_oyashikistay/",
      image: "./image/en_oyashikistay_PCKV.jpg",
    },
    {
      name: "Luxury Central Tokyo Stay — Marunouchi City Tour",
      location: "Tokyo",
      url: "https://wabunka-lux.jp/itineraries/kitanohotel-koikeshuko",
      image: "./image/en_oyashikistay_AR04.jpg",
    },
    {
      name: "Explore Sacred Mt. Mitake — Private Riverside Villa",
      location: "Okutama",
      url: "https://wabunka-lux.jp/itineraries/mt-tokyo-fushi",
      image: "./image/en_oyashikistay_AR05.jpg",
    },
    {
      name: "Unwind in Okutama — Tour a 300-Year Old Sake Brewery",
      location: "Okutama",
      url: "https://wabunka-lux.jp/itineraries/satologue-ozawashuzo",
      image: "./image/en_oyashikistay_PCCA01.jpg",
    },
    {
      name: "Matsuzakaya Stay — Historic Machiya in Tokyo",
      location: "Tokyo",
      url: "https://wabunka-lux.jp/experiences/en_matsuzakaya-stay/",
      image: "./image/images_en_ochiairo_sub_20_51525c7b.jpg",
    },
    {
      name: "Miwa Yugawara — Hot Spring & Mountain Retreat",
      location: "Kanagawa",
      url: "https://wabunka-lux.jp/experiences/en_miwayugawara/",
      image: "./image/en_fujiseiran_PCKV.jpg",
    },
    {
      name: "Fujiya Hotel — Explore the Old Tokaido Road",
      location: "Hakone",
      url: "https://wabunka-lux.jp/itineraries/fujiya-explorehakone",
      image: "./image/images_267478b2-ba8a-4d25-b193-fbfd8d7afb2a.jpeg",
    },
    {
      name: "Fuji Seiran — Luxury Stay in Hakone & Numazu",
      location: "Hakone · Numazu",
      url: "https://wabunka-lux.jp/itineraries/fujiseiran-ashinoko-numazu",
      image: "./image/images_3355d8a4-508d-4e54-a644-74ea2bc35a4c.jpeg",
    },
    {
      name: "Ochiairo Ryokan — A Valley Retreat of Rare Intimacy",
      location: "Izu, Shizuoka",
      url: "https://wabunka-lux.jp/experiences/en_ochiairo/",
      image: "./image/images_6950af3c-239b-4e88-9f60-6d27867c77ca.jpeg",
    },
    {
      name: "Private Onsen with a View of Mt. Fuji",
      location: "Shizuoka",
      url: "https://wabunka-lux.jp/s/experiences",
      image: "./image/images_6faac036-f236-4b4b-b543-1f62ea9bee8a.jpeg",
    },
    {
      name: "Lounge with Mt. Fuji — Refined Day Retreat",
      location: "Hakone",
      url: "https://wabunka-lux.jp/s/experiences",
      image: "./image/images_d704a0a1-b6ab-410b-b11c-59ec5b1e991e.jpeg",
    },
    {
      name: "Seaside Infinity Bath — Coastal Wellness",
      location: "Shizuoka",
      url: "https://wabunka-lux.jp/s/experiences",
      image: "./image/en_meitokuan_AR05.jpg",
    },
    {
      name: "Forest Spa — Architecture in Nature",
      location: "Hakone",
      url: "https://wabunka-lux.jp/s/experiences",
      image: "./image/en_takigahara-natadera_SN6.jpg",
    },
    {
      name: "Garden-View Retreat — Quiet Tokyo Stay",
      location: "Tokyo",
      url: "https://wabunka-lux.jp/experiences/en_matsuzakaya-stay/",
      image: "./image/images_en_ochiairo_sub_9_49698ae4.jpg",
    },
    {
      name: "Hana Ougi — Elegant City Sanctuary",
      location: "Tokyo",
      url: "https://wabunka-lux.jp/experiences/en_hanaoug/",
      image: "./image/miyama_PCKV (1).jpg",
    },
    {
      name: "Riverside Villa — Sacred Mt. Mitake Journey",
      location: "Okutama",
      url: "https://wabunka-lux.jp/itineraries/mt-tokyo-fushi",
      image: "./image/images_en_yoshida-sanso_sub_6_c1af9ffb (1).jpg",
    },
    {
      name: "Satologue — Forest Stay & Sake Culture",
      location: "Okutama",
      url: "https://wabunka-lux.jp/itineraries/satologue-ozawashuzo",
      image: "./image/007.jpg",
    },
    {
      name: "Ashinoko & Numazu — Fuji Outlook Experience",
      location: "Shizuoka",
      url: "https://wabunka-lux.jp/itineraries/fujiseiran-ashinoko-numazu",
      image: "./image/00278.jpg",
    },
    {
      name: "Tokaido Heritage Walk — Fujiya Hotel Stay",
      location: "Hakone",
      url: "https://wabunka-lux.jp/itineraries/fujiya-explorehakone",
      image: "./image/006.jpg",
    },
    {
      name: "Yugawara Onsen — Mountain & Sea Serenity",
      location: "Kanagawa",
      url: "https://wabunka-lux.jp/experiences/en_miwayugawara/",
      image: "./image/202106_R105_太田 (9).jpg",
    },
  ],
  chubu: [
    {
      name: "Tour Hakone & Numazu — Luxury Stay at Fuji Seiran",
      location: "Hakone · Numazu",
      url: "https://wabunka-lux.jp/itineraries/fujiseiran-ashinoko-numazu",
      image: "./image/images_267478b2-ba8a-4d25-b193-fbfd8d7afb2a.jpeg",
    },
    {
      name: "Hakone Gora Byakudan — Premium Sake Tasting",
      location: "Hakone",
      url: "https://wabunka-lux.jp/itineraries/hakone-byakudan-setoshuzo",
      image: "./image/images_267478b2-ba8a-4d25-b193-fbfd8d7afb2a.jpeg",
    },
    {
      name: "Stay at Fujiya Hotel — Hike the Old Tokaido Road",
      location: "Hakone",
      url: "https://wabunka-lux.jp/itineraries/fujiya-explorehakone",
      image: "./image/images_267478b2-ba8a-4d25-b193-fbfd8d7afb2a.jpeg",
    },
    {
      name: "Rediscover Rural Japan — Family-Owned Ryokan in Hida",
      location: "Hida Takayama",
      url: "https://wabunka-lux.jp/itineraries/busuitei",
      image: "./image/images_267478b2-ba8a-4d25-b193-fbfd8d7afb2a.jpeg",
    },
    {
      name: "Unwind at a Stylish Ryokan — Artisanal Woodworking",
      location: "Hida Takayama",
      url: "https://wabunka-lux.jp/itineraries/hidatei-kazehikaru",
      image: "./image/images_267478b2-ba8a-4d25-b193-fbfd8d7afb2a.jpeg",
    },
    {
      name: "Tour Mt. Fuji & Yamanashi Wineries at nôtori",
      location: "Yamanashi",
      url: "https://wabunka-lux.jp/itineraries/notori-thousandth-wineries",
      image: "./image/images_267478b2-ba8a-4d25-b193-fbfd8d7afb2a.jpeg",
    },
    {
      name: "Rural Life in Yamanashi — Farm Stay & Vineyard Tour",
      location: "Yamanashi",
      url: "https://wabunka-lux.jp/itineraries/agriturismo-yutaka",
      image: "./image/images_267478b2-ba8a-4d25-b193-fbfd8d7afb2a.jpeg",
    },
    {
      name: "Yamanaka Onsen — Lacquerware Artisan Experience",
      location: "Kanazawa",
      url: "https://wabunka-lux.jp/itineraries/hanamurasaki-yukamabune",
      image: "./image/images_267478b2-ba8a-4d25-b193-fbfd8d7afb2a.jpeg",
    },
  ],
  kansai: [
    {
      name: "ART MON ZEN KYOTO — Meitoku-an Tea Ceremony",
      location: "Kyoto",
      url: "https://wabunka-lux.jp/experiences/en_meitokuan/",
      image: "./image/en_meitokuan_AR05.jpg",
    },
    {
      name: "Hiiragiya Ryokan — Forge Your Own Japanese Knife",
      location: "Kyoto",
      url: "https://wabunka-lux.jp/itineraries/hiiragiya-kanetaka-hamono",
      image: "./image/en_meitokuan_AR05.jpg",
    },
    {
      name: "Hiiragiya Ryokan — Traditional Silk Dyeing",
      location: "Kyoto",
      url: "https://wabunka-lux.jp/itineraries/hiiragiya-atelier-shimura",
      image: "./image/en_oyashikistay_AR04.jpg",
    },
    {
      name: "Sumiya Ryokan — Learn Kintsugi with a Local Artisan",
      location: "Kyoto",
      url: "https://wabunka-lux.jp/itineraries/sumiya-shikata",
      image: "./image/en_meitokuan_AR05.jpg",
    },
    {
      name: "Hiiragiya Ryokan — An Evening with a Geisha",
      location: "Kyoto",
      url: "https://wabunka-lux.jp/itineraries/hiiragiya-geisha",
      image: "./image/en_oyashikistay_AR04.jpg",
    },
    {
      name: "Traditional Thatched Villa in Miyama, Rural Kyoto",
      location: "Kyoto Rural",
      url: "https://wabunka-lux.jp/itineraries/miyama-honkan",
      image: "./image/en_meitokuan_AR05.jpg",
    },
    {
      name: "Escape into National Park Forests near Osaka",
      location: "Osaka",
      url: "https://wabunka-lux.jp/experiences/en_meitokuan/",
      image: "./image/en_oyashikistay_AR04.jpg",
    },
    {
      name: "Kominka Folk Inn — History & Bounties in Gokasho",
      location: "Nara",
      url: "https://wabunka-lux.jp/itineraries/nipponia-gokasho-ukarokkon",
      image: "./image/en_meitokuan_AR05.jpg",
    },
  ],
  chugoku_shikoku: [
    {
      name: "Simose Art Garden Villa — World-Class Architecture",
      location: "Hiroshima",
      url: "https://wabunka-lux.jp/experiences/en_simose/",
      image: "./image/ryokankurashiki_AR22.jpg",
    },
    {
      name: "Onomichi Ryokan — Sake, Soy Sauce & Zen Temple",
      location: "Onomichi",
      url: "https://wabunka-lux.jp/itineraries/onomichi-3days",
      image: "./image/ryokankurashiki_AR22.jpg",
    },
    {
      name: "Ryokan Kurashiki — Historic Sugar Merchant Manor",
      location: "Kurashiki",
      url: "https://wabunka-lux.jp/experiences/en_ryokankurashiki-basic/",
      image: "./image/ryokankurashiki_AR22.jpg",
    },
    {
      name: "Private Villa on Shodoshima — Olive Groves & Pilgrimages",
      location: "Naoshima & Islands",
      url: "https://wabunka-lux.jp/experiences/en_oyashikistay/",
      image: "./image/ryokankurashiki_AR22.jpg",
    },
    {
      name: "Seto Inland Sea — Historic Soy Sauce Brewery & Inn",
      location: "Seto Inland Sea",
      url: "https://wabunka-lux.jp/itineraries/shintoyo-okamotoshoyu",
      image: "./image/ryokankurashiki_AR22.jpg",
    },
  ],
  kyushu: [
    {
      name: "Enter a World of Historic Townhouses in Sakai City",
      location: "Osaka / Sakai",
      url: "https://wabunka-lux.jp/experiences/en_sakainoma_yanagi/",
      image: "./image/en_oyashikistay_PCKV.jpg",
    },
  ],
};

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderArea(key) {
  const info = AREA_INFO[key];
  const stays = MAP_STAYS[key] || [];
  if (!info) return;

  document.getElementById("mapDefaultMsg").style.display = "none";
  const areaInfo = document.getElementById("mapAreaInfo");
  areaInfo.style.display = "flex";
  registerReveal(areaInfo, 0);

  const imgEl = document.getElementById("mapAreaImg");
  if (imgEl && info.image) {
    imgEl.src = info.image;
    imgEl.alt = info.title;
  }

  document.getElementById("mapAreaRegion").textContent = info.region;
  document.getElementById("mapAreaTitle").textContent = info.title;
  document.getElementById("mapAreaDesc").textContent = info.desc;
  document.getElementById("mapAreaTags").innerHTML = info.tags
    .map((t) => `<span class="map-area-tag">${escapeHtml(t)}</span>`)
    .join("");

  const section = document.getElementById("mapStaysSection");
  const grid = document.getElementById("mapStaysGrid");
  const label = document.getElementById("mapStaysLabel");

  if (!stays.length) {
    section.style.display = "block";
    label.textContent = "";
    grid.innerHTML = `<p class="map-stays-empty">More stays coming soon for this region.</p>`;
    if (typeof window.registerMapStayReveals === "function") {
      window.registerMapStayReveals(section);
    }
    return;
  }

  label.textContent = `${info.title} — ${stays.length} curated experience${stays.length > 1 ? "s" : ""}`;
  grid.innerHTML = stays
    .map(
      (stay) => `
    <a class="map-stay-card" href="${escapeHtml(stay.url)}" target="_blank" rel="noopener">
<img src="${escapeHtml(stay.image)}" alt="${escapeHtml(stay.name)}" loading="lazy" decoding="async" />
<div class="map-stay-card-body">
  <p class="map-stay-card-name">${escapeHtml(stay.name)}</p>
  <p class="map-stay-card-loc">${escapeHtml(stay.location)}</p>
</div>
    </a>
  `
    )
    .join("");

  section.style.display = "block";
  if (typeof window.registerMapStayReveals === "function") {
    window.registerMapStayReveals(section);
  }
}

const regionEls = document.querySelectorAll(".jp-region[data-region]");
regionEls.forEach((el) => {
  el.style.pointerEvents = "auto";
  el.addEventListener("click", (e) => {
    if (!el.contains(e.target)) return;
    regionEls.forEach((r) => r.classList.remove("is-active"));
    el.classList.add("is-active");
    renderArea(el.dataset.region);
  });
  el.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    regionEls.forEach((r) => r.classList.remove("is-active"));
    el.classList.add("is-active");
    renderArea(el.dataset.region);
  });
});

const mapTabEls = document.querySelectorAll("[data-map-tab]");
const destinationsPanel = document.getElementById("destinationsPanel");
const themesPanel = document.getElementById("themesPanel");

mapTabEls.forEach((tab) => {
  tab.addEventListener("click", () => {
    mapTabEls.forEach((t) => t.classList.toggle("is-active", t === tab));
    const key = tab.getAttribute("data-map-tab");
    if (destinationsPanel) destinationsPanel.style.display = key === "destinations" ? "block" : "none";
    if (themesPanel) themesPanel.style.display = key === "themes" ? "block" : "none";
  });
});


// Gallery slider
renderGalleryFromData();
(function initGallerySlider() {
  const root = document.querySelector("[data-gallery-slider]");
  if (!root) return;

  const track = root.querySelector(".gallery-track");
  const viewport = root.querySelector(".gallery-viewport");
  const prevBtn = root.querySelector(".gallery-nav--prev");
  const nextBtn = root.querySelector(".gallery-nav--next");
  const slides = root.querySelectorAll(".gallery-slide");
  if (!track || !viewport || !slides.length) return;

  let index = 0;

  function getGap() {
    return parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || "0") || 0;
  }

  function getVisibleCount() {
    const step = getStep();
    if (!step) return 1;
    return Math.max(1, (viewport.clientWidth + getGap()) / step);
  }

  function getStep() {
    const slide = slides[0];
    if (!slide) return 0;
    return slide.getBoundingClientRect().width + getGap();
  }

  function getMaxIndex() {
    return Math.max(0, Math.ceil(slides.length - getVisibleCount()));
  }

  function update() {
    const maxIndex = getMaxIndex();
    index = Math.min(Math.max(index, 0), maxIndex);
    track.style.transform = `translateX(${-index * getStep()}px)`;
    if (prevBtn) prevBtn.disabled = index <= 0;
    if (nextBtn) nextBtn.disabled = index >= maxIndex;
  }

  prevBtn?.addEventListener("click", () => {
    index -= 1;
    update();
  });

  nextBtn?.addEventListener("click", () => {
    index += 1;
    update();
  });

  window.addEventListener("resize", update);
  if (document.fonts?.ready) {
    document.fonts.ready.then(update);
  }
  window.addEventListener("load", update);
  update();
})();

// Gallery modal (View More)
(function initGalleryModal() {
  const modal = document.getElementById("galleryModal");
  const openBtn = document.querySelector("[data-gallery-open]");
  if (!modal || !openBtn) return;

  const panel = modal.querySelector(".gallery-modal__panel");
  const closeBtn = modal.querySelector("[data-gallery-close]");
  let lastFocused = null;

  function openModal() {
    lastFocused = document.activeElement;
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    modal.classList.add("is-open");
    document.body.classList.add("gallery-modal-open");
    closeBtn?.focus();
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    modal.hidden = true;
    document.body.classList.remove("gallery-modal-open");
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  openBtn.addEventListener("click", openModal);
  closeBtn?.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  panel?.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
})();

// Hero KV slideshow
(function initHeroSlideshow() {
  const slides = document.querySelectorAll(".hero__slide");
  if (slides.length < 2) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    slides.forEach((slide, i) => slide.classList.toggle("is-active", i === 0));
    return;
  }

  let index = 0;
  const intervalMs = 5500;

  setInterval(() => {
    slides[index].classList.remove("is-active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("is-active");
  }, intervalMs);
})();

// デフォルトで関東を選択済み状態にする
const defaultRegion = "kanto";
const defaultEl = document.querySelector(
  '.jp-region[data-region="' + defaultRegion + '"]'
);
if (defaultEl) {
  defaultEl.classList.add("is-active");
}
renderArea(defaultRegion);
document.getElementById("mapDefaultMsg") &&
  (document.getElementById("mapDefaultMsg").style.display = "none");
document.getElementById("mapAreaInfo") &&
  (document.getElementById("mapAreaInfo").style.display = "flex");

