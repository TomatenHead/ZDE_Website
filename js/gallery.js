// Gallery runtime: detect available screenshots, build the infinite carousel, and add controls.
const galleryTrack = document.getElementById("galleryTrack");
const imageCountElement = document.getElementById("image-count");
const activeIndexElement = document.getElementById("active-index");
const fallbackPanel = document.getElementById("fallbackPanel");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const toggleAuto = document.getElementById("toggleAuto");

let images = [];
let currentIndex = 1;
let autoScrollActive = false;
let autoScrollTimer = null;
let isTransitioning = false;
const maxScan = 30;
const basePaths = ["screenshots/screenshot", "screenshots/screen"];
const extensions = ["png", "jpg", "jpeg"];

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(url);
        img.onerror = () => reject(url);
    });
}

async function detectGalleryImages() {
    const found = [];

    for (let i = 1; i <= maxScan; i++) {
        let loaded = false;

        for (const base of basePaths) {
            for (const ext of extensions) {
                const path = `${base}${i}.${ext}`;

                try {
                    await loadImage(path);
                    found.push(path);
                    loaded = true;
                    break;
                } catch (error) {
                    // try the next extension
                }
            }
            if (loaded) break;
        }

        if (!loaded) {
            break;
        }
    }

    return found;
}

function updateStatus() {
    if (!imageCountElement || !activeIndexElement) return;
    imageCountElement.textContent = `${images.length} images detected`;
    const visibleIndex = images.length ? ((currentIndex - 1 + images.length) % images.length) + 1 : 0;
    activeIndexElement.textContent = `${visibleIndex} / ${images.length}`;
}

function createSlide(src) {
    const card = document.createElement("article");
    card.className = "gallery-card";
    card.innerHTML = `<img src="${src}" alt="Screenshot preview" loading="lazy" />`;
    return card;
}

function buildCarousel() {
    galleryTrack.innerHTML = "";

    if (images.length === 0) return;

    const slides = [images[images.length - 1], ...images, images[0]];
    slides.forEach((src) => galleryTrack.appendChild(createSlide(src)));
    requestAnimationFrame(() => setTrackPosition(currentIndex));
}

function setTrackPosition(index, animate = true) {
    const card = galleryTrack.querySelector(".gallery-card");
    const cardWidth = card ? card.offsetWidth : 420;
    const gap = 20;
    const offset = index * (cardWidth + gap);

    galleryTrack.style.transition = animate ? "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)" : "none";
    galleryTrack.style.transform = `translateX(-${offset}px)`;
}

function moveTo(index) {
    if (isTransitioning || images.length === 0) return;
    isTransitioning = true;
    currentIndex = index;
    setTrackPosition(currentIndex);
    updateStatus();
}

function moveNext() {
    moveTo(currentIndex + 1);
}

function movePrev() {
    moveTo(currentIndex - 1);
}

function handleTransitionEnd() {
    const slideCount = images.length;

    if (currentIndex === 0) {
        currentIndex = slideCount;
        setTrackPosition(currentIndex, false);
    }

    if (currentIndex === slideCount + 1) {
        currentIndex = 1;
        setTrackPosition(currentIndex, false);
    }

    isTransitioning = false;
    updateStatus();
}

function startAutoScroll() {
    if (autoScrollTimer) clearInterval(autoScrollTimer);
    autoScrollTimer = setInterval(() => moveNext(), 4200);
}

function stopAutoScroll() {
    if (autoScrollTimer) {
        clearInterval(autoScrollTimer);
        autoScrollTimer = null;
    }
}

function toggleAutoScroll() {
    autoScrollActive = !autoScrollActive;
    toggleAuto.textContent = autoScrollActive ? "Pause Auto" : "Auto Scroll";
    autoScrollActive ? startAutoScroll() : stopAutoScroll();
}

function bindEvents() {
    nextBtn?.addEventListener("click", moveNext);
    prevBtn?.addEventListener("click", movePrev);
    toggleAuto?.addEventListener("click", toggleAutoScroll);
    galleryTrack?.addEventListener("transitionend", handleTransitionEnd);

    window.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
            event.preventDefault();
            moveNext();
        }
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            movePrev();
        }
    });
}

async function initGallery() {
    images = await detectGalleryImages();

    if (images.length === 0) {
        if (fallbackPanel) {
            fallbackPanel.style.display = "block";
            fallbackPanel.textContent = "No screenshots were found in screenshots/. Please add files named screenshot1.png, screenshot2.jpg, or screen1.png.";
        }
        updateStatus();
        return;
    }

    if (fallbackPanel) fallbackPanel.style.display = "none";
    updateStatus();
    buildCarousel();
    bindEvents();
}

initGallery();
