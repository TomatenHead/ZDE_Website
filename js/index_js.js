// ===============================
// HERO TYPING EFFECT
// ===============================
const heroText = document.getElementById("hero-text");

const heroLines = [
  "Zero Day Exploit",
  "A satirical hacking adventure",
  "Break systems. Not laws.",
  "Enter the breach..."
];

let hIndex = 0;
let hChar = 0;

function typeHero() {
  if (hChar < heroLines[hIndex].length) {
    heroText.textContent += heroLines[hIndex][hChar];
    hChar++;
    setTimeout(typeHero, 60);
  } else {
    setTimeout(() => {
      heroText.textContent = "";
      hChar = 0;
      hIndex = (hIndex + 1) % heroLines.length;
      typeHero();
    }, 1800);
  }
}

typeHero();


// ===============================
// TERMINAL SYSTEM
// ===============================
const terminal = document.getElementById("terminal");

const downloadMessages = [
  "Scanning network nodes",
  "Initializing payload injector",
  "Bypassing Firewall v6",
  "Decrypting packet stream",
  "Uploading exploit package"
];

// Prüfen ob Element sichtbar
function isVisible(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

// Fortschrittsbalken erzeugen
function makeBar(progress) {
  const total = 26;
  const filled = Math.floor((progress / 100) * total);
  const empty = total - filled;
  return `[${"█".repeat(filled)}${"░".repeat(empty)}] ${progress}%`;
}

let runCount = 0;
const maxRuns = 5;

// Einen neuen Ladevorgang starten
function startDownloadTask() {
  if (runCount >= maxRuns) {
    const final = document.createElement("p");
    final.textContent = "C:\\Users\\admin\\virus.exe distributed";
    terminal.appendChild(final);
    terminal.scrollTop = terminal.scrollHeight;
    return;
  }

  const text = downloadMessages[runCount % downloadMessages.length];
  const line = document.createElement("p");
  line.textContent = text + "...";
  terminal.appendChild(line);

  const barLine = document.createElement("p");
  terminal.appendChild(barLine);

  let progress = 0;

  function updateBar() {
    progress += Math.floor(Math.random() * 8) + 4; // Geschwindigkeit

    if (progress > 100) progress = 100;

    barLine.textContent = makeBar(progress);
    terminal.scrollTop = terminal.scrollHeight;

    if (progress < 100) {
      setTimeout(updateBar, Math.random() * 180 + 80);
    } else {
      // Nächster Vorgang
      runCount++;
      setTimeout(startDownloadTask, 600);
    }
  }

  updateBar();
}

startDownloadTask();
