// Kleine Animation für "Start Contributing" Button
const startBtn = document.getElementById("start-contribute-btn");
startBtn.addEventListener("mouseenter", () => {
    startBtn.style.transform = "scale(1.1)";
});
startBtn.addEventListener("mouseleave", () => {
    startBtn.style.transform = "scale(1)";
});
