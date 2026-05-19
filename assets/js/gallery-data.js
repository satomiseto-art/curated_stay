/**
 * Gallery image list (prototype).
 * Production: replace with API response.
 */
window.GALLERY_ITEMS = [
  { src: "./image/en_fujiseiran_PCKV.jpg", alt: "Mt. Fuji and onsen stay" },
  { src: "./image/002.jpg", alt: "Japanese interior" },
  { src: "./image/003.jpg", alt: "Traditional room detail" },
  { src: "./image/004.jpg", alt: "Garden view" },
  { src: "./image/005.jpg", alt: "Curated stay" },
  { src: "./image/en_oyashikistay_AR05.jpg", alt: "Oyashiki stay" },
  { src: "./image/en_meitokuan_AR05.jpg", alt: "Meitokuan" },
  { src: "./image/en_takigahara-natadera_SN6.jpg", alt: "Takigahara Natadera" },
  {
    src: "./image/images_d704a0a1-b6ab-410b-b11c-59ec5b1e991e.jpeg",
    alt: "Artisan sanctuary",
  },
];

function renderGalleryFromData() {
  const items = window.GALLERY_ITEMS || [];
  const track = document.querySelector("[data-gallery-track]");
  const grid = document.querySelector("[data-gallery-modal-grid]");
  if (!track || !grid || !items.length) return;

  const slideHtml = (item, index) =>
    `<figure class="gallery-slide">
      <img src="${item.src}" alt="${item.alt || ""}" loading="${index === 0 ? "eager" : "lazy"}" decoding="async" />
    </figure>`;

  const modalHtml = (item) =>
    `<figure class="gallery-modal__item">
      <img src="${item.src}" alt="${item.alt || ""}" loading="lazy" decoding="async" />
    </figure>`;

  track.innerHTML = items.map(slideHtml).join("");
  grid.innerHTML = items.map(modalHtml).join("");
}
