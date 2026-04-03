// Gallery runtime: auto-detect screenshots, build infinite carousel, and add controls.
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
const maxScan = 24;
const basePaths = ["screenshots/screenshot", "screenshots/screen"];

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
            const path = `${base}${i}.png`;

            try {
                await loadImage(path);
                found.push(path);
                loaded = true;
                break;
            } catch (error) {
                // continue to next pattern
            }
        }

        if (!loaded) {
            break;
        }
    }

    return found;
}

function updateStatus() {
    imageCountElement.textContent = images.length.toString();
    const visibleIndex = ((currentIndex - 1 + images.length) % images.length) + 1;
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
    const slides = [];

    if (images.length === 0) return;

    slides.push(images[images.length - 1]);
    images.forEach((src) => slides.push(src));
    slides.push(images[0]);

    slides.forEach((src) => galleryTrack.appendChild(createSlide(src)));
    requestAnimationFrame(() => setTrackPosition(currentIndex));
}

function setTrackPosition(index, animate = true) {
    const cardWidth = galleryTrack.querySelector(".gallery-card")?.offsetWidth || 420;
    const gap = 22;
    const offset = index * (cardWidth + gap);

    if (!animate) {
        galleryTrack.style.transition = "none";
    } else {
        galleryTrack.style.transition = "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)";
    }

    galleryTrack.style.transform = `translateX(-${offset}px)`;
}

function moveTo(index) {
    if (isTransitioning) return;
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

    if (autoScrollActive) {
        startAutoScroll();
    } else {
        stopAutoScroll();
    }
}

function bindEvents() {
    nextBtn.addEventListener("click", moveNext);
    prevBtn.addEventListener("click", movePrev);
    toggleAuto.addEventListener("click", toggleAutoScroll);

    galleryTrack.addEventListener("transitionend", handleTransitionEnd);

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
        fallbackPanel.style.display = "block";
        return;
    }

    fallbackPanel.style.display = "none";
    updateStatus();
    buildCarousel();
    bindEvents();
}

initGallery();
