/* script.js — polished menu + anime characters + full game flow */

/* helpers */
const $ = (id) => document.getElementById(id);
function show(id) {
  ["menu", "settings", "credits", "game", "result"].forEach((s) =>
    $(s).classList.remove("active")
  );
  $(id).classList.add("active");
}
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* DOM bindings */
const charMale = $("char-male");
const charFemale = $("char-female");
const charList = document.querySelectorAll(".char-card");
const playerNameInput = $("player-name");

const openSettings = $("open-settings");
const startBtn = $("start");
const startGameBtn = $("start-game");
const backMenuBtn = $("back-menu");
const openCreditsBtn = $("open-credits");
const creditsBackBtn = $("credits-back");

const levelSelect = $("level-select");
const musicToggle = $("music-toggle");
const sfxToggle = $("sfx-toggle");

const hudAvatar = $("hud-avatar");
const hudName = $("hud-name");
const hudLevel = $("hud-level");
const hudScore = $("hud-score");
const hudProgress = $("hud-progress");

const qImage = $("q-image");
const imgSrc = $("img-src");
const qText = $("q-text");
const choicesWrap = $("choices");

const nextBtn = $("next");
const quitBtn = $("quit");

const sCorrect = $("s-correct");
const sWrong = $("s-wrong");

const replayBtn = $("replay");
const toMenuBtn = $("to-menu");
const resultText = $("result-text");

/* state */
let chosenChar = "male";
let chosenCharSrc = null; // we will use SVG content for avatar preview
let playerName = "Player";
let musicOn = true;
let sfxOn = true;
let difficulty = "easy";
let questions = [];
let current = 0;
let score = 0;
let answered = false;

/* question bank (same as before, 10 per level) */
const BANK = {
  easy: [
    {
      q: "Lampu bohlam menyala karena energi ...",
      o: [
        "Listrik → Cahaya",
        "Panas → Cahaya",
        "Kimia → Cahaya",
        "Gerak → Cahaya",
      ],
      a: 0,
      tags: ["light-bulb", "lamp"],
    },
    {
      q: "Setrika menghasilkan panas dari energi ...",
      o: [
        "Listrik → Panas",
        "Gerak → Panas",
        "Cahaya → Panas",
        "Kimia → Panas",
      ],
      a: 0,
      tags: ["iron", "heater"],
    },
    {
      q: "Kipas angin bekerja karena energi ...",
      o: [
        "Listrik → Gerak",
        "Gerak → Listrik",
        "Panas → Gerak",
        "Cahaya → Gerak",
      ],
      a: 0,
      tags: ["fan", "wind"],
    },
    {
      q: "Senter menyala karena perubahan energi dari ...",
      o: [
        "Kimia → Cahaya",
        "Cahaya → Kimia",
        "Panas → Cahaya",
        "Listrik → Cahaya",
      ],
      a: 0,
      tags: ["flashlight", "battery"],
    },
    {
      q: "Kompor gas menghasilkan energi ...",
      o: [
        "Kimia → Panas",
        "Listrik → Panas",
        "Cahaya → Panas",
        "Gerak → Panas",
      ],
      a: 0,
      tags: ["gas-stove", "flame"],
    },
    {
      q: "Panel surya mengubah energi ...",
      o: [
        "Cahaya → Listrik",
        "Listrik → Cahaya",
        "Panas → Listrik",
        "Kimia → Listrik",
      ],
      a: 0,
      tags: ["solar-panel", "sun"],
    },
    {
      q: "Jam tangan baterai bekerja dari energi ...",
      o: ["Kimia → Gerak", "Listrik → Gerak", "Gerak → Kimia", "Panas → Gerak"],
      a: 0,
      tags: ["watch", "battery"],
    },
    {
      q: "Televisi menampilkan gambar karena energi ...",
      o: [
        "Listrik → Cahaya & Suara",
        "Kimia → Cahaya",
        "Gerak → Cahaya",
        "Panas → Cahaya",
      ],
      a: 0,
      tags: ["television", "screen"],
    },
    {
      q: "Kulkas menggunakan energi ...",
      o: [
        "Listrik → Pendinginan",
        "Panas → Listrik",
        "Cahaya → Listrik",
        "Kimia → Panas",
      ],
      a: 0,
      tags: ["refrigerator", "cold"],
    },
    {
      q: "Panci panas menunjukkan transfer energi berupa ...",
      o: [
        "Panas → Panas (konduksi)",
        "Cahaya → Panas",
        "Kimia → Panas",
        "Gerak → Panas",
      ],
      a: 0,
      tags: ["pan", "kitchen"],
    },
  ],
  medium: [
    {
      q: "Pembangkit listrik tenaga air mengubah energi ...",
      o: [
        "Gerak air → Listrik",
        "Panas → Gerak",
        "Cahaya → Listrik",
        "Kimia → Listrik",
      ],
      a: 0,
      tags: ["hydropower", "water"],
    },
    {
      q: "Turbin angin mengubah energi ...",
      o: [
        "Gerak udara → Listrik",
        "Listrik → Gerak",
        "Cahaya → Gerak",
        "Kimia → Gerak",
      ],
      a: 0,
      tags: ["wind-turbine", "wind"],
    },
    {
      q: "Blender bekerja karena energi ...",
      o: [
        "Listrik → Gerak",
        "Gerak → Listrik",
        "Kimia → Gerak",
        "Panas → Gerak",
      ],
      a: 0,
      tags: ["blender", "kitchen"],
    },
    {
      q: "Mobil bensin bergerak karena energi ...",
      o: [
        "Kimia → Gerak",
        "Listrik → Gerak",
        "Panas → Gerak",
        "Cahaya → Gerak",
      ],
      a: 0,
      tags: ["car", "engine"],
    },
    {
      q: "Pembangkit panas bumi memanfaatkan energi ...",
      o: [
        "Panas → Listrik",
        "Gerak → Listrik",
        "Kimia → Listrik",
        "Cahaya → Listrik",
      ],
      a: 0,
      tags: ["geothermal", "steam"],
    },
    {
      q: "Lilin menyala karena energi ...",
      o: [
        "Kimia → Panas & Cahaya",
        "Panas → Cahaya",
        "Listrik → Cahaya",
        "Gerak → Cahaya",
      ],
      a: 0,
      tags: ["candle", "flame"],
    },
    {
      q: "Kamera digital bekerja karena energi ...",
      o: [
        "Listrik → Cahaya (sensor)",
        "Cahaya → Listrik",
        "Kimia → Cahaya",
        "Gerak → Cahaya",
      ],
      a: 0,
      tags: ["camera", "photography"],
    },
    {
      q: "Generator sepeda mengubah energi ...",
      o: [
        "Gerak → Listrik",
        "Listrik → Gerak",
        "Cahaya → Gerak",
        "Kimia → Gerak",
      ],
      a: 0,
      tags: ["bicycle", "dynamo"],
    },
    {
      q: "Kulkas memindahkan panas menggunakan ...",
      o: [
        "Energi listrik untuk memindahkan panas",
        "Energi kimia menjadi panas",
        "Cahaya menjadi panas",
        "Gerak menjadi panas",
      ],
      a: 0,
      tags: ["refrigeration", "cold"],
    },
    {
      q: "Pembangkit batu bara mengubah energi ...",
      o: [
        "Kimia → Panas → Listrik",
        "Panas → Kimia",
        "Gerak → Panas",
        "Cahaya → Kimia",
      ],
      a: 0,
      tags: ["coal-plant", "factory"],
    },
  ],
  hard: [
    {
      q: "PLTN menghasilkan listrik dari energi ...",
      o: [
        "Nuklir → Panas → Listrik",
        "Kimia → Listrik",
        "Cahaya → Listrik",
        "Gerak → Listrik",
      ],
      a: 0,
      tags: ["nuclear", "reactor"],
    },
    {
      q: "Sel bahan bakar mengubah energi ...",
      o: [
        "Kimia → Listrik",
        "Panas → Listrik",
        "Cahaya → Kimia",
        "Gerak → Listrik",
      ],
      a: 0,
      tags: ["fuel-cell", "chemistry"],
    },
    {
      q: "Panel termoelektrik mengubah energi panas menjadi ...",
      o: [
        "Panas → Listrik",
        "Listrik → Panas",
        "Gerak → Listrik",
        "Cahaya → Listrik",
      ],
      a: 0,
      tags: ["thermoelectric", "heat"],
    },
    {
      q: "Fotosintesis mengubah energi ...",
      o: [
        "Cahaya → Kimia",
        "Kimia → Cahaya",
        "Panas → Kimia",
        "Listrik → Kimia",
      ],
      a: 0,
      tags: ["photosynthesis", "plant"],
    },
    {
      q: "Reaksi eksotermik melepaskan energi terutama sebagai ...",
      o: ["Panas (dan kadang cahaya)", "Elektrik", "Gerak"],
      a: 0,
      tags: ["reaction", "chemistry lab"],
    },
    {
      q: "Motor sinkron menerima energi ...",
      o: [
        "Listrik → Gerak",
        "Gerak → Listrik",
        "Panas → Gerak",
        "Kimia → Gerak",
      ],
      a: 0,
      tags: ["electric-motor", "motor"],
    },
    {
      q: "Panas laten terkait dengan ...",
      o: [
        "Perubahan fase tanpa perubahan temperatur",
        "Listrik langsung",
        "Kimia langsung",
      ],
      a: 0,
      tags: ["phase-change", "ice"],
    },
    {
      q: "Fuel cell hidrogen menghasilkan ...",
      o: ["Listrik (dan panas)", "Cahaya", "Gerak"],
      a: 0,
      tags: ["hydrogen", "fuel-cell"],
    },
    {
      q: "Penukar panas mentransfer energi berupa ...",
      o: ["Panas → Panas (transfer)", "Listrik → Panas", "Gerak → Listrik"],
      a: 0,
      tags: ["heat-exchanger", "industrial"],
    },
    {
      q: "Efisiensi termodinamika mengukur konversi ...",
      o: ["Panas → Kerja (mekanik)", "Kimia → Panas", "Cahaya → Kerja"],
      a: 0,
      tags: ["thermodynamics", "science"],
    },
  ],
};

/* ---------- particles background (simple) ---------- */
(function makeParticles() {
  const p = document.getElementById("particles");
  const count = 40;
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "particle";
    el.style.left = Math.random() * 100 + "%";
    el.style.top = Math.random() * 100 + "%";
    el.style.opacity = 0.2 + Math.random() * 0.6;
    el.style.transform = `scale(${0.3 + Math.random() * 1})`;
    p.appendChild(el);
  }
})();

/* ---------- character selection ---------- */
charList.forEach((btn) => {
  btn.addEventListener("click", () => {
    charList.forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    chosenChar = btn.dataset.char || "male";
    // use the inline SVG HTML as "avatar" preview
    chosenCharSrc = btn.querySelector(".char-svg").outerHTML;
  });
});

/* menu wiring */
openSettings.addEventListener("click", () => show("settings"));
openCreditsBtn.addEventListener("click", () => show("credits"));
creditsBackBtn.addEventListener("click", () => show("menu"));
startBtn.addEventListener("click", () => show("settings"));
backMenuBtn.addEventListener("click", () => show("menu"));

/* audio: WebAudio ambient pad (same approach) */
let audioCtx = null,
  musicGain = null,
  oscA = null,
  oscB = null;
function startAmbient() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    musicGain = audioCtx.createGain();
    musicGain.gain.value = 0.06;
    musicGain.connect(audioCtx.destination);
    const lpf = audioCtx.createBiquadFilter();
    lpf.type = "lowpass";
    lpf.frequency.value = 900;
    lpf.connect(musicGain);

    oscA = audioCtx.createOscillator();
    oscA.type = "sine";
    oscA.frequency.value = 110;
    const gA = audioCtx.createGain();
    gA.gain.value = 0.5;
    oscA.connect(gA);
    gA.connect(lpf);

    oscB = audioCtx.createOscillator();
    oscB.type = "sine";
    oscB.frequency.value = 132;
    oscB.detune.value = 7;
    const gB = audioCtx.createGain();
    gB.gain.value = 0.35;
    oscB.connect(gB);
    gB.connect(lpf);

    const mod = audioCtx.createOscillator();
    mod.frequency.value = 0.09;
    const modG = audioCtx.createGain();
    modG.gain.value = 0.02;
    mod.connect(modG);
    modG.connect(musicGain.gain);

    oscA.start();
    oscB.start();
    mod.start();
    audioCtx.resume();
  }
}
function stopAmbient() {
  if (audioCtx) {
    musicGain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioCtx.currentTime + 0.6
    );
    setTimeout(() => {
      try {
        audioCtx.close();
      } catch (e) {}
      audioCtx = null;
    }, 700);
  }
}

/* start game from settings */
startGameBtn.addEventListener("click", () => {
  difficulty = levelSelect.value || "easy";
  musicOn = musicToggle.checked;
  sfxOn = sfxToggle.checked;
  const nameVal = (playerNameInput.value || "").trim();
  playerName = nameVal ? nameVal : "Player";
  hudName.textContent = playerName;
  hudLevel.textContent =
    "Level: " +
    (difficulty === "easy"
      ? "Easy"
      : difficulty === "medium"
      ? "Medium"
      : "Hard");
  // set HUD avatar: use inline SVG copy for crispness
  const avatarHTML =
    chosenCharSrc ||
    document.querySelector(".char-card.selected .char-svg").outerHTML;
  hudAvatar.innerHTML = avatarHTML;
  if (musicOn) startAmbient();
  else stopAmbient();
  startGame();
});

/* game flow */
function startGame() {
  const pool = [...BANK[difficulty]];
  shuffle(pool);
  questions = pool.slice(0, 10).map((q) => JSON.parse(JSON.stringify(q)));
  current = 0;
  score = 0;
  answered = false;
  hudScore.textContent = "Score: 0";
  hudProgress.textContent = `1 / ${questions.length}`;
  show("game");
  render();
}

function render() {
  const item = questions[current];
  qText.textContent = item.q;
  const tags =
    item.tags && item.tags.length
      ? item.tags.slice(0, 2).join(",")
      : "chemistry,lab";
  qImage.src = `https://source.unsplash.com/collection/190727/720x720/?${encodeURIComponent(
    tags
  )}`;
  imgSrc.textContent = `Illustration: ${tags.replace(/,/g, ", ")}`;
  const opts = item.o.map((t, i) => ({ t, i }));
  shuffle(opts);
  choicesWrap.innerHTML = "";
  answered = false;
  nextBtn.disabled = true;

  opts.forEach((opt) => {
    const b = document.createElement("button");
    b.className = "option-btn";
    b.dataset.orig = opt.i;
    const sp = document.createElement("span");
    sp.className = "icon";
    sp.textContent = pickIcon(opt.t);
    const txt = document.createElement("div");
    txt.className = "txt";
    txt.textContent = opt.t;
    b.appendChild(sp);
    b.appendChild(txt);
    b.addEventListener("click", () =>
      selectAnswer(parseInt(b.dataset.orig, 10), b)
    );
    choicesWrap.appendChild(b);
  });

  hudProgress.textContent = `${current + 1} / ${questions.length}`;
}

/* icon heuristic */
function pickIcon(text) {
  const t = text.toLowerCase();
  if (t.includes("listrik")) return "⚡";
  if (t.includes("cahaya") || t.includes("light")) return "💡";
  if (t.includes("panas") || t.includes("heat")) return "🔥";
  if (t.includes("kimia") || t.includes("chemical")) return "🧪";
  if (t.includes("gerak")) return "🔧";
  if (t.includes("air") || t.includes("hydro")) return "💧";
  return "🔬";
}

/* answer handling */
function selectAnswer(origIndex, btn) {
  if (answered) return;
  answered = true;
  const correct = questions[current].a;
  const buttons = Array.from(document.querySelectorAll(".option-btn"));
  buttons.forEach((b) => (b.disabled = true));

  if (origIndex === correct) {
    btn.classList.add("correct");
    score++;
    hudScore.textContent = `Score: ${score}`;
    if (sfxOn) {
      sCorrect.currentTime = 0;
      sCorrect.play();
    }
  } else {
    btn.classList.add("wrong");
    if (sfxOn) {
      sWrong.currentTime = 0;
      sWrong.play();
    }
    const right = buttons.find((b) => parseInt(b.dataset.orig, 10) === correct);
    if (right) right.classList.add("correct");
  }

  nextBtn.disabled = false;
}

/* next/quit/finish */
nextBtn.addEventListener("click", () => {
  if (!answered) return;
  current++;
  if (current < questions.length) render();
  else finish();
});
quitBtn.addEventListener("click", () => {
  if (confirm("Return to menu? Progress will be lost.")) {
    stopAmbient();
    show("menu");
  }
});

function finish() {
  show("result");
  resultText.textContent = `${playerName}, your score is ${score} out of ${questions.length}`;
  stopAmbient();
}

/* replay / menu */
replayBtn.addEventListener("click", () => {
  if (musicToggle.checked) startAmbient();
  startGame();
});
toMenuBtn.addEventListener("click", () => {
  stopAmbient();
  show("menu");
});

/* init defaults */
document.querySelector(".char-card.selected")?.classList.add("selected");
chosenCharSrc = document.querySelector(
  ".char-card.selected .char-svg"
)?.outerHTML;
show("menu");
