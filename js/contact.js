// Copy email on click
document.getElementById("copyEmail").addEventListener("click", () => {
    const email = "y-game-studios@gmx.de";

    navigator.clipboard.writeText(email).then(() => {
        showToast("Email copied to clipboard!");
    });
});

// Toast popup
function showToast(text) {
    const toast = document.getElementById("toast");
    toast.textContent = text;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}
