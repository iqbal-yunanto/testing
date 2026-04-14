let totalTime = 0;

function showModal(title, message) {
  document.getElementById("modalTitle").innerText = title;
  document.getElementById("modalMessage").innerText = message;
  document.getElementById("customModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("customModal").style.display = "none";

  // Cek apakah user sedang berada di screen 'word_game' (game terakhir)
  // dan apakah game sudah selesai (foundCount === words.length)
  const isLastGameFinished =
    document.getElementById("word_game").classList.contains("active") &&
    foundCount === words.length;

  if (isLastGameFinished) {
    const inst = document.getElementById("kartiniInst");
    if (inst) {
      inst.currentTime = 0;
      inst.play().catch((e) => console.log("Backsound blocked"));
    }
  }
}

function playTing() {
  const ting = document.getElementById("ting");
  if (ting) {
    ting.currentTime = 0; // Reset ke awal jika tombol diklik cepat
    ting.play().catch((e) => console.log("Audio play blocked"));
  }
}

// diubah jadi time

function next(id) {
  const currentScreen = document.querySelector(".screen.active");
  const nextScreen = document.getElementById(id);

  // 1. Fade out screen yang sekarang (jika ada)
  if (currentScreen) {
    currentScreen.classList.remove("fade-in");

    // Tunggu animasi fade out selesai (500ms sesuai CSS)
    setTimeout(() => {
      currentScreen.classList.remove("active");
      switchToNext(id);
    }, 500);
  } else {
    // Jika tidak ada screen aktif (saat pertama kali load)
    switchToNext(id);
  }
}

// Fungsi pembantu untuk memproses perpindahan
function switchToNext(id) {
  const nextScreen = document.getElementById(id);
  const nextlevel = document.getElementById("nextLevelSfx");
  const opening = document.getElementById("opening");

  // Logika suara (tetap sama seperti kode Anda sebelumnya)
  const isTypingPage = id.includes("_text") || id === "ending";
  const isSpecialPage = id === "rank_screen";
  if (nextlevel && !isTypingPage && !isSpecialPage) {
    nextlevel.currentTime = 0;
    nextlevel.play().catch((e) => {});
  }

  // Aktifkan screen baru
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active", "fade-in"));
  nextScreen.classList.add("active");

  // Trigger Fade In di frame berikutnya agar browser sempat menangkap perubahan class
  setTimeout(() => {
    nextScreen.classList.add("fade-in");
  }, 50);

  // Logika spesifik per halaman (mengetik, audio, dll)
  handleScreenSpecials(id);
}

// Pindahkan logika spesifik id ke sini agar fungsi next lebih bersih
function handleScreenSpecials(id) {
  const opening = document.getElementById("opening");

  if (id === "p1_text") {
    opening.play().catch((e) => {});
    document.getElementById("typeSfx").volume = 0.4;
  }

  if (id === "home") {
    totalTime = 0;
    opening.pause();
    opening.currentTime = 0;
    const typeSfx = document.getElementById("typeSfx");
    if (typeSfx) {
      typeSfx.pause();
      typeSfx.currentTime = 0;
    }
  }

  // Pemicu mengetik
  if (id === "p1_text") startTyping(1);
  if (id === "p2_text") startTyping(2);
  if (id === "p3_text") startTyping(3);
  if (id === "word_text") startTyping(4);
  if (id === "ending") startTyping(5);
}

const texts = {
  1: "Since childhood, Kartini was known as a bright and curious girl. She believed that education was the key to the future.",
  2: "Despite limitations, Kartini continued to think forward. Through her writings, she expressed her hopes for equality.",
  3: "Her struggle brought meaningful change for women in Indonesia. Kartini became a symbol of courage and inspiration.",
  4: "Find Kartini's qualities: Smart, Brave, Strong, Caring and others.",
  // Bagian nasehat diubah menjadi array string
  5: [
    "For all students..",
    "Keep learning and dare to dream big for your future.",
    "With knowledge, you will have the confidence to be your best self.",
    "Being your best self helps you become independent and never give up.",
    "Once you are strong, always remember to lend a hand to others.",
    "Because by doing good, your path will always be bright and full of hope.",
  ],
};

let i = 0,
  currentText = "",
  currentIndex = 0;

function startTyping(index) {
  i = 0;
  currentIndex = index;

  const revealBtn = document.getElementById("revealBtn");
  if (revealBtn) revealBtn.style.display = "none";

  // LOGIKA KHUSUS UNTUK ENDING (INDEX 5) - VERSI KONTINYU
  if (index === 5) {
    const container = document.getElementById("credits-container");
    container.innerHTML = ""; // Bersihkan kontainer lama
    startContinuousCredits(); // Panggil fungsi baru
  } else {
    // Logika mengetik biasa untuk screen 1-4
    currentText = texts[index];
    const el = document.getElementById("typing" + index);
    if (el) el.innerHTML = "";
    const btn = document.getElementById("btn" + index);
    if (btn) btn.style.display = "none";
    typeWriter();
  }
}

function startContinuousCredits() {
  const container = document.getElementById("credits-container");
  const verses = texts[5];
  let verseIndex = 0;

  // Variabel untuk menampung total tinggi tumpukan teks yang sudah muncul
  let currentYPosition = 0;

  // Jarak antar bait (pixel)
  const gapBetweenVerses = 30;

  // Jeda waktu antar kemunculan bait (3.5 detik)
  // Kita beri jeda lebih lama dari durasi transisi CSS (3s) agar tidak tumpang tindih visual
  const appearanceInterval = 3500;

  function spawnVerseRecursive(index) {
    if (index < verses.length) {
      // 1. Buat elemen
      const p = document.createElement("p");
      p.className = "advice-verse";
      p.innerText = verses[index];

      // 2. Set posisi 'top' bait ini di tumpukan terbawah saat ini
      // JANGAN AKTIFKAN TRANSISI DULU
      p.style.transition = "none";
      p.style.top = currentYPosition + "px";

      container.appendChild(p);

      // 3. Hitung tinggi elemen yang baru dibuat ini
      const verseHeight = p.offsetHeight;

      // 4. Update posisi Y untuk bait berikutnya
      currentYPosition += verseHeight + gapBetweenVerses;

      // 5. Kembalikan transisi CSS & picu gerakan naik
      // Beri sedikit delay agar browser mencatat posisi 'top' aslinya dulu
      setTimeout(() => {
        p.style.transition = ""; // Kembalikan ke settingan CSS asli
        p.classList.add("visible"); // Picu transform translateY(0)
        //  playTing(); // Efek suara
      }, 50);

      // 6. Panggil bait berikutnya setelah jeda waktu
      setTimeout(() => {
        spawnVerseRecursive(index + 1);
      }, appearanceInterval);
    } else {
      // SEMUA TEKS SELESAI DIPICU
      // Tampilkan tombol Reveal setelah bait terakhir diperkirakan berhenti meluncur
      setTimeout(() => {
        const revealBtn = document.getElementById("revealBtn");
        if (revealBtn) {
          revealBtn.style.display = "inline-block";
          revealBtn.classList.add("popIn"); // Gunakan animasi popIn yang sudah ada
        }
      }, 4000); // Tunggu 4 detik setelah bait terakhir dipicu
    }
  }

  // Bersihkan container & mulai proses rekursif dari bait 0
  container.innerHTML = "";
  spawnVerseRecursive(0);
}
function goToRank() {
  // Hentikan instrumental Kartini
  const inst = document.getElementById("kartiniInst");
  if (inst) {
    inst.pause();
    inst.currentTime = 0; // Reset ke awal
  }

  next("rank_screen");
  startReveal();
}

function typeWriter() {
  // PENCEGAHAN: Jika ini adalah ending (indeks 5), keluar dari fungsi ini.
  // Logika ending sudah ditangani oleh startContinuousCredits.
  if (currentIndex === 5) return;

  const el = document.getElementById("typing" + currentIndex);
  const typeSfx = document.getElementById("typeSfx");

  // Jika elemen tidak ditemukan, jangan lanjutkan agar tidak error
  if (!el) return;

  if (i < currentText.length) {
    let c = currentText.charAt(i);
    el.innerHTML += c;

    // --- LOGIKA SFX KETIK ---
    if (typeSfx) {
      if (c !== " ") {
        if (typeSfx.paused) {
          typeSfx.play().catch((e) => {});
        }
        typeSfx.volume = 1;
      } else {
        typeSfx.volume = 0; // Senyap saat spasi agar suara lebih natural
      }
    }

    i++;
    // Atur delay ketik: lebih lambat jika ketemu tanda baca
    let delay = c.match(/[.,:]/) ? 300 : 80;
    setTimeout(typeWriter, delay);
  } else {
    // --- JIKA SELESAI MENGETIK ---
    if (typeSfx) {
      typeSfx.pause();
      typeSfx.currentTime = 0;
    }

    // Tampilkan tombol Next untuk screen 1 sampai 4
    if (currentIndex >= 1 && currentIndex <= 4) {
      const nextBtn = document.getElementById("btn" + currentIndex);
      if (nextBtn) {
        nextBtn.style.display = "inline-block";
      }
    }
  }
}

/* ===== PUZZLE ASLI (DIKEMBALIKAN FULL) ===== */
/* ===== DYNAMIC PUZZLE ENGINE ===== */
function createPuzzle(config) {
  // Kita ambil 'size' dari config, lalu buat 'imgPath' secara otomatis di sini
  const { size, puzzleId, timerId, startBtnId, nextBtnId } = config;

  // Otomatisasi nama folder: jika size 3, jadi "images3x3"
  const imgPath = `images${size}x${size}`;

  const puzzle = document.getElementById(puzzleId);
  const timerText = document.getElementById(timerId);
  const containerSize = 360; // Ukuran tetap box puzzle kita

  let tiles = Array.from({ length: size * size }, (_, i) => i + 1);
  let dragIndex = null,
    timer = 0,
    interval = null;
  let started = false,
    finished = false;

  // Kalkulasi otomatis ukuran tile berdasarkan angka grid (size)
  const tileSize = containerSize / size;

  /* Update di dalam fungsi createPuzzle */
  function render() {
    puzzle.innerHTML = "";
    puzzle.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    tiles.forEach((tile, index) => {
      const div = document.createElement("div");
      div.classList.add("tile");
      div.style.height = `${tileSize}px`;
      div.style.backgroundImage = `url('${imgPath}/${tile}.png')`;
      div.style.backgroundSize = "cover";

      // --- LOGIKA MOUSE ---
      div.draggable = started;
      div.ondragstart = () => {
        dragIndex = index;
        div.classList.add("dragging");
      };
      div.ondragover = (e) => e.preventDefault();
      div.ondrop = () => handleSwap(index);

      // --- LOGIKA TOUCH (UNTUK TABLET) ---
      div.addEventListener(
        "touchstart",
        (e) => {
          if (!started || finished) return;
          dragIndex = index;
          div.classList.add("dragging");
          // Mencegah scroll saat menyentuh puzzle
          // e.preventDefault();
        },
        { passive: true },
      );

      div.addEventListener("touchend", (e) => {
        div.classList.remove("dragging");
        // Cari elemen apa yang ada di bawah jari saat dilepas
        const touch = e.changedTouches[0];
        const targetEl = document.elementFromPoint(
          touch.clientX,
          touch.clientY,
        );
        const targetTile = targetEl ? targetEl.closest(".tile") : null;

        if (targetTile) {
          // Cari index tile target dalam array DOM
          const allTiles = Array.from(puzzle.children);
          const targetIndex = allTiles.indexOf(targetTile);
          if (targetIndex !== -1) handleSwap(targetIndex);
        }
      });

      puzzle.appendChild(div);
    });
  }

  // Fungsi pembantu swap agar tidak duplikasi code
  function handleSwap(index) {
    if (dragIndex !== null && dragIndex !== index) {
      [tiles[dragIndex], tiles[index]] = [tiles[index], tiles[dragIndex]];
      const swapSfx = document.getElementById("swap-sfx");
      if (swapSfx) {
        swapSfx.currentTime = 0;
        swapSfx.play().catch(() => {});
      }
      render();
      checkWin();
    }
  }

  function checkWin() {
    const isWin = tiles.every((tile, i) => tile === i + 1);
    if (isWin && started) {
      clearInterval(interval);
      finished = true;
      playAudio("successSfx");
      totalTime += timer;
      document.getElementById(nextBtnId).style.display = "inline-block";
      document.getElementById(startBtnId).style.display = "none";
      setTimeout(() => showModal("Excellent!", `Solved in ${timer}s`), 200);
    }
  }

  function playAudio(id) {
    const sfx = document.getElementById(id);
    if (sfx) {
      sfx.currentTime = 0;
      sfx.play().catch(() => {});
    }
  }

  function start() {
    if (started) return;
    playTing();
    started = true;
    tiles.sort(() => Math.random() - 0.5); // Acak kepingan
    render();
    interval = setInterval(() => {
      timer++;
      timerText.textContent = `Time: ${timer} seconds`;
    }, 1000);
    document.getElementById(startBtnId).disabled = true;
  }

  render();
  return start;
}

/* INIT PUZZLE */
/* Cukup ganti angka pada properti 'size' 
   untuk mengubah tingkat kesulitan masing-masing game.
*/

const startGame = createPuzzle({
  size: 3, // <--- Ganti ini (misal ke 2 untuk 2x2)
  puzzleId: "puzzle",
  timerId: "timer",
  startBtnId: "startBtn",
  nextBtnId: "nextPuzzle1",
});

const startGame2 = createPuzzle({
  size: 4, // <--- Ganti ini
  puzzleId: "puzzle2",
  timerId: "timer2",
  startBtnId: "startBtn2",
  nextBtnId: "nextPuzzle2",
});

const startGame3 = createPuzzle({
  size: 5, // <--- Ganti ini
  puzzleId: "puzzle3",
  timerId: "timer3",
  startBtnId: "startBtn3",
  nextBtnId: "nextPuzzle3",
});

/* ===== WORD SEARCH (FULL ASLI) ===== */
// const words = ["INTELLIGENT"];

const words = ["SMART", "BRAVE", "CARING", "STRONG", "KIND"];
const colors = [
  "#e74c3c",
  "#3498db",
  "#2ecc71",
  "#f39c12",
  "#9b59b6",
  "#1abc9c",
  "#e67e22",
  "#34495e",
  "#ff69b4",
  "#16a085",
];

let foundCount = 0;
let timerInterval;
let time = 0;
let gameStarted = false;
let isDragging = false;
let selectedCells = [];

const gridSize = 10; // Kembali ke 12x12
let grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));
const gridElement = document.getElementById("grid");
const wordListElement = document.getElementById("word-list");
const timerEl = document.getElementById("timerWord");
const startBtnWord = document.getElementById("startBtnWord");

for (let i = 0; i < gridSize; i++) {
  grid[i] = [];
  for (let j = 0; j < gridSize; j++) grid[i][j] = "";
}

const directions = [
  [0, 1],
  [1, 0],
  [1, 1],
  [-1, 1],
];

// Fungsi pengecekan apakah kata bisa diletakkan
function canPlace(word, r, c, dr, dc) {
  for (let i = 0; i < word.length; i++) {
    let row = r + i * dr;
    let col = c + i * dc;
    if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return false;
    if (grid[row][col] !== "" && grid[row][col] !== word[i]) return false;
  }
  return true;
}

// Fungsi utama penempatan kata (dengan sistem coba-ulang/retry)
function generateWordSearch() {
  let allPlaced = false;
  while (!allPlaced) {
    grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));
    allPlaced = true;

    for (const word of words) {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 100) {
        let dir = directions[Math.floor(Math.random() * directions.length)];
        let r = Math.floor(Math.random() * gridSize);
        let c = Math.floor(Math.random() * gridSize);

        if (canPlace(word, r, c, dir[0], dir[1])) {
          for (let i = 0; i < word.length; i++) {
            grid[r + i * dir[0]][c + i * dir[1]] = word[i];
          }
          placed = true;
        }
        attempts++;
      }
      if (!placed) {
        allPlaced = false;
        break; // Ulangi dari kata pertama jika satu kata gagal terpasang
      }
    }
  }
}

// Eksekusi generator
generateWordSearch();

// Isi kotak kosong
for (let i = 0; i < gridSize; i++)
  for (let j = 0; j < gridSize; j++)
    if (grid[i][j] === "")
      grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));

/* === REVISI PEMBUATAN GRID WORDSEARCH === */
let cells = [];
for (let i = 0; i < gridSize; i++) {
  for (let j = 0; j < gridSize; j++) {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.letter = grid[i][j];
    cell.dataset.row = i;
    cell.dataset.col = j;

    let letterSpan = document.createElement("span");
    letterSpan.textContent = ""; // Biarkan kosong sampai tombol Start ditekan

    cell.appendChild(letterSpan);
    gridElement.appendChild(cell);
    cells.push(cell);

    // --- PASANG SEMUA EVENT DI SINI ---

    // Mouse Events
    letterSpan.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      startSelection(cell);
    });
    letterSpan.addEventListener("mouseenter", () => {
      if (isDragging) continueSelection(cell);
    });

    // Touch Events (Khusus Tablet)
    letterSpan.addEventListener(
      "touchstart",
      (e) => {
        if (!gameStarted) return;
        // Jangan pakai preventDefault agar tombol 'Start' tetap bisa ditekan
        startSelection(cell);
      },
      { passive: true },
    );

    letterSpan.addEventListener(
      "touchmove",
      (e) => {
        if (!gameStarted || !isDragging) return;

        // Matikan scroll layar saat jari sedang menarik kata
        if (e.cancelable) e.preventDefault();

        const touch = e.touches[0];
        const targetEl = document.elementFromPoint(
          touch.clientX,
          touch.clientY,
        );
        const cellEl = targetEl ? targetEl.closest(".cell") : null;

        if (cellEl) {
          continueSelection(cellEl);
        }
      },
      { passive: false },
    ); // Wajib false agar preventDefault bekerja
  }
}

// Tambahkan listener ini untuk mengakhiri seleksi di tablet
window.addEventListener("touchend", endSelection);

window.addEventListener("mouseup", endSelection);

words.forEach((word) => {
  let div = document.createElement("div");
  div.classList.add("word");
  div.textContent = word;
  div.id = word;
  wordListElement.appendChild(div);
});

function isAdjacent(cell1, cell2) {
  const r1 = parseInt(cell1.dataset.row),
    c1 = parseInt(cell1.dataset.col);
  const r2 = parseInt(cell2.dataset.row),
    c2 = parseInt(cell2.dataset.col);
  return Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1;
}

function startSelection(cell) {
  if (!gameStarted) return;
  isDragging = true;
  selectedCells = [cell];
  cell.classList.add("selecting");
}

function continueSelection(cell) {
  if (!gameStarted || !isDragging) return;
  const lastCell = selectedCells[selectedCells.length - 1];
  if (
    selectedCells.length > 1 &&
    cell === selectedCells[selectedCells.length - 2]
  ) {
    selectedCells.pop().classList.remove("selecting");
  } else if (!selectedCells.includes(cell) && isAdjacent(lastCell, cell)) {
    selectedCells.push(cell);
    cell.classList.add("selecting");
    // --- TAMBAHKAN SUARA PICK DI SINI ---
    const pickSfx = document.getElementById("pick-sfx");
    if (pickSfx) {
      pickSfx.currentTime = 0;
      pickSfx.play().catch((e) => {});
    }
  }
}

function endSelection() {
  if (!isDragging) return;
  isDragging = false;
  checkWord();
  cells.forEach((c) => c.classList.remove("selecting"));
  selectedCells = [];
}

/* === REVISI TOMBOL START WORDSEARCH === */
startBtnWord.addEventListener("click", () => {
  playTing();
  gameStarted = true;
  startBtnWord.style.display = "none";

  const finishBtn = document.getElementById("finishBtn");
  if (finishBtn) {
    finishBtn.style.display = "inline-block";
    finishBtn.disabled = true;
  }

  // Mulai Timer
  timerInterval = setInterval(() => {
    time++;
    timerEl.textContent = "Time: " + time + " Seconds";
  }, 1000);

  // Animasi Huruf Muncul per Kolom
  cells.forEach((cell) => {
    const span = cell.querySelector("span");
    const colIndex = parseInt(cell.dataset.col);

    setTimeout(() => {
      span.textContent = cell.dataset.letter;
      span.classList.add("letter-animate");
    }, colIndex * 60);
  });
});

function checkWord() {
  let selectedWord = selectedCells.map((c) => c.dataset.letter).join("");
  let reversed = selectedWord.split("").reverse().join("");
  let isCorrect = false;

  words.forEach((word, index) => {
    let wordEl = document.getElementById(word);

    // Cek apakah kata cocok (normal atau terbalik) dan belum ditemukan
    if (
      (selectedWord === word || reversed === word) &&
      !wordEl.classList.contains("found")
    ) {
      isCorrect = true;
      let color = colors[index % colors.length];

      // Pastikan urutan animasi selalu dari awal kata (bukan arah drag)
      let sequence =
        selectedWord === word ? selectedCells : [...selectedCells].reverse();

      // --- LOGIKA OVERLAPPING WAVE (EFEK BERUNTUN) ---
      const animDuration = 300; // Durasi animasi 1 cell (0.3s)
      const intervalJeda = 100; // Jeda 1/3 waktu (100ms) agar berhimpitan

      sequence.forEach((c, i) => {
        let startDelay = i * intervalJeda;

        setTimeout(() => {
          // Warnai sel tepat saat animasinya mulai
          c.style.background = color;
          c.style.color = "white";
          c.style.borderColor = "transparent";

          // Tambahkan class animasi CSS
          c.classList.add("wave-effect");

          // Hapus class setelah durasi animasi penuh (300ms)
          setTimeout(() => {
            c.classList.remove("wave-effect");
          }, animDuration);
        }, startDelay);
      });
      // ----------------------------------------------

      // Tandai di list kata sebelah kanan
      wordEl.classList.add("found");
      wordEl.style.color = color;
      foundCount++;

      // Suara Correct
      const correctSfx = document.getElementById("correct-sfx");
      if (correctSfx) {
        correctSfx.currentTime = 0;
        correctSfx.play().catch((e) => {});
      }

      // Cek jika game selesai (semua kata ketemu)
      if (foundCount === words.length) {
        clearInterval(timerInterval);
        totalTime += time;

        const endGame = document.getElementById("endGame");
        if (endGame) {
          endGame.currentTime = 0;
          endGame.play().catch((e) => {});
        }

        // Munculkan alert setelah animasi kata terakhir selesai
        const totalWait =
          sequence.length * intervalJeda + (animDuration - intervalJeda);
        setTimeout(() => {
          document.getElementById("finishBtn").disabled = false;
          showModal(
            "🎉 Excellent!",
            "You've completed in " + time + " seconds!",
          );
        }, totalWait);

        document.getElementById("finishBtn").style.display = "inline-block";
      }
    }
  });

  // Jika tarikan salah (lebih dari 1 huruf agar tidak mengganggu klik tunggal)
  if (!isCorrect && selectedCells.length > 1) {
    const wrongSfx = document.getElementById("wrong-sfx");
    if (wrongSfx) {
      wrongSfx.currentTime = 0;
      wrongSfx.play().catch((e) => {});
    }
  }
}

/* ===== RANK SYSTEM ===== */
const tiers = [
  { tier: "Tier 1", rank: "👑 Superstar", max: 120 },
  { tier: "Tier 2", rank: "🤩 Excellent", max: 180 },
  { tier: "Tier 3", rank: "😄 Awesome", max: 240 },
  { tier: "Tier 4", rank: "😊 Very Good", max: 300 },
  { tier: "Tier 5", rank: "🙂 Good", max: 9999 },
];

function getRankByTime(time) {
  return tiers.find((t) => time <= t.max);
}

/* ===== REVEAL FUNCTION ===== */
function startReveal() {
  const box = document.getElementById("box");
  const result = document.getElementById("result");
  const spinSfx = document.getElementById("spinSfx");

  // Mainkan suara putaran
  if (spinSfx) {
    spinSfx.currentTime = 0;
    spinSfx.play().catch((e) => {});
  }

  result.innerHTML = "Calculating your result...";
  result.classList.add("show");
  box.innerHTML = "🏆";
  box.classList.add("shake");

  let count = 0;
  const maxSpins = 35; // Jumlah acakan teks agar pas dengan durasi 3 detik

  const rolling = setInterval(() => {
    const random = tiers[Math.floor(Math.random() * tiers.length)];

    result.innerHTML = `
      <div class="tier">${random.tier}</div>
      <div class="rank">${random.rank}</div>
    `;

    count++;

    // Berhenti saat mencapai batas (disesuaikan dengan panjang suara spin-sfx)
    if (count > maxSpins) {
      clearInterval(rolling);
      box.classList.remove("shake");

      // Hasil Akhir
      const final = getRankByTime(totalTime);
      result.innerHTML = `
        <div class="tier">${final.tier}</div>
        <div class="rank">${final.rank}</div>
      `;

      document.getElementById("totalTimeText").innerText =
        "Total Time: " + totalTime + " seconds";

      if (final.tier === "Tier 1") {
        document.querySelector(".rank").classList.add("superstar");
        document.body.style.background = "#fff3cd";
        box.innerHTML = "👑";
        startCelebration(7000);
      } else {
        startCelebration(4000);
      }
    }
  }, 120); // Interval 120ms membuat putaran terasa pas dengan durasi audio 3 detik
}

/* ===== CELEBRATION EFFECT ===== */
let balloonInterval, confettiInterval;

function startCelebration(duration) {
  // Hentikan selebrasi sebelumnya jika ada
  stopCelebration();

  const congrats = document.getElementById("congrats");
  if (congrats) {
    congrats.currentTime = 0;
    congrats.play().catch((e) => console.log("Audio play blocked"));
  }

  // --- LOGIKA FIREWORKS ---
  var animationEnd = Date.now() + duration;
  var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 11000 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Kita gunakan setInterval agar kembang api muncul terus menerus selama durasi
  confettiInterval = setInterval(function () {
    var timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(confettiInterval);
    }

    var particleCount = 50 * (timeLeft / duration);

    // Tembakan kembang api di posisi acak kiri dan kanan
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      }),
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      }),
    );
  }, 250);

  // Logika Balon (Opsional, jika masih mau pakai balon)
  // --- FIXED BALLOON LOGIC ---
  balloonInterval = setInterval(() => {
    const b = document.createElement("div");
    b.className = "balloon";

    // Variasi emoji agar lebih vibrant untuk murid-murid
    const emojis = ["🎈", "🌸", "✨", "💖"];
    b.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];

    // Gunakan 90vw agar balon tidak memicu scrollbar horizontal di layar kecil
    b.style.left = Math.random() * 90 + "vw";

    document.body.appendChild(b);

    // Hapus elemen dari DOM setelah animasi selesai agar browser tidak berat
    setTimeout(() => b.remove(), 5000);
  }, 400); // Muncul setiap 0.4 detik

  setTimeout(stopCelebration, duration);
}
function stopCelebration() {
  clearInterval(balloonInterval);
  clearInterval(confettiInterval);
  // Library canvas-confetti akan berhenti sendiri saat durasi habis,
  // tapi jika ingin menghentikan paksa semua partikel di layar:
  // confetti.reset();
}
