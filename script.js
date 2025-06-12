function createSongSlider({
  containerId,
  prevBtnClass,
  nextBtnClass,
  songsArray,
  visibleCards = 5,
}) {
  const container = document.getElementById(containerId);
  const prevBtn = container.parentElement.querySelector(`.${prevBtnClass}`);
  const nextBtn = container.parentElement.querySelector(`.${nextBtnClass}`);
  const totalCards = songsArray.length;
  const cardWidth = 195 + 20;
  let index = 0;
  let widthmultiplier = cardWidth;
  let limiter = 0;
  if (visibleCards >= 5) {
    limiter = 3;
    widthmultiplier = 3 * cardWidth - limiter;
  }
  

  songsArray.forEach((song) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card_img">
        <div>
          <svg height="24" width="24" fill="white" viewBox="0 0 24 24">
            <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
          </svg>
        </div>
        <img src="${song.cover}" alt="music_cover">
      </div>
      <div class="card_desc">
        <div>${song.title}</div>
        <div>${song.artist}</div>
      </div>
    `;
    container.appendChild(card);
  });

  const cards = container.querySelectorAll(".card");
  cards.forEach((card, idx) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      currentPlaylist = songsArray;
      currentIndex = idx;
      loadSong(currentIndex);
      playSong();
    });
  });

  function updateSlider() {
    container.style.transition = "transform 0.5s ease";
    container.style.transform = `translateX(-${index * widthmultiplier}px)`;

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index >= totalCards - visibleCards;

    prevBtn.style.cursor = prevBtn.disabled ? "not-allowed" : "pointer";
    nextBtn.style.cursor = nextBtn.disabled ? "not-allowed" : "pointer";
  }

  prevBtn.addEventListener("click", () => {
    if (index > 0) {
      index--;
      updateSlider();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (index < totalCards - visibleCards - limiter) {
      index++;
      updateSlider();
    }
  });

  updateSlider();
}
createSongSlider({
  containerId: "songs_container",
  prevBtnClass: "prev-btn",
  nextBtnClass: "next-btn",
  songsArray: trending_songs,
});
createSongSlider({
  containerId: "artist_container",
  prevBtnClass: "artist_prev",
  nextBtnClass: "artist_next",
  songsArray: Artist,
  visibleCards: 3,
});

createSongSlider({
  containerId: "keyur_container",
  prevBtnClass: "prev-btn",
  nextBtnClass: "next-btn",
  songsArray: keyur_songs,
});

// --- Audio Player Logic ---

let currentIndex = 0;
let isPlaying = false;
let isRepeat = false;
let isShuffle = false;
let currentPlaylist = trending_songs; // Default playlist

const audio = new Audio();
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const repeatBtn = document.getElementById("repeat");
const shuffleBtn = document.getElementById("shuffle");
const progressSlider = document.querySelector(".progress_slider");
const currentTimeSpan = document.querySelector(".current_time");
const totalTimeSpan = document.querySelector(".total_time");
const songTitle = document.querySelector(".song_title h3");
const songSubtitle = document.querySelector(".song_subtitle");
const songImg = document.querySelector(".current_img img");
const playPauseBtn = document.getElementById("play_pause");

// --- Song Card Click Logic ---

function makeCardsPlayable(containerId, playlistArr) {
  const container = document.getElementById(containerId);
  // Wait for cards to be rendered
  setTimeout(() => {
    const cards = container.querySelectorAll(".card");
    cards.forEach((card, idx) => {
      card.style.cursor = "pointer";
      card.addEventListener("click", () => {
        currentPlaylist = playlistArr;
        currentIndex = idx;
        loadSong(currentIndex);
        playSong();
      });
    });
  }, 0);
}

// Call after sliders are created
makeCardsPlayable("songs_container", trending_songs);
makeCardsPlayable("keyur_container", keyur_songs);

// --- Player Functions ---

function loadSong(index) {
  const song = currentPlaylist[index];
  if (!song) return;
  audio.src = song.src;
  songTitle.textContent = song.title;
  songSubtitle.textContent = song.artist;
  songImg.src = song.cover;
  audio.load();
  updateProgress();
}

function playSong() {
  audio.play();
  isPlaying = true;
  playPauseBtn.innerHTML = `<svg stroke="currentColor" fill="currentColor" id="pause" stroke-width="0" viewBox="0 0 16 16"
    color="#FFF" class="cursor-pointer" height="45" width="45"
    xmlns="http://www.w3.org/2000/svg" style="color: rgb(255, 255, 255) ">
    <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"></path>
  </svg>`;
    document.querySelector('.player_class').classList.add('playing');
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playPauseBtn.innerHTML = `<svg stroke="currentColor" fill="currentColor" id="play" stroke-width="0" viewBox="0 0 16 16"
    color="#FFF" class="cursor-pointer" height="45" width="45"
    xmlns="http://www.w3.org/2000/svg" style="color: rgb(255, 255, 255)">
    <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
  </svg>`;
  document.querySelector('.player_class').classList.remove('playing');
}

function nextSong() {
  if (isShuffle) {
    currentIndex = Math.floor(Math.random() * currentPlaylist.length);
  } else {
    currentIndex = (currentIndex + 1) % currentPlaylist.length;
  }
  loadSong(currentIndex);
  playSong();
}

function prevSong() {
  if (isShuffle) {
    currentIndex = Math.floor(Math.random() * currentPlaylist.length);
  } else {
    currentIndex =
      (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
  }
  loadSong(currentIndex);
  playSong();
}

function updateProgress() {
  if (!audio.duration) {
    progressSlider.value = 0;
    totalTimeSpan.textContent = "0:00";
    currentTimeSpan.textContent = "0:00";
    return;
  }
  progressSlider.value = (audio.currentTime / audio.duration) * 100;
  currentTimeSpan.textContent = formatTime(audio.currentTime);
  totalTimeSpan.textContent = formatTime(audio.duration);
}

function formatTime(sec) {
  sec = Math.floor(sec);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

// --- Event Listeners ---

playPauseBtn.addEventListener("click", () => {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.style.color = isRepeat ? "var(--spotify-green)" : "white";
});

shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.style.color = isShuffle ? "var(--spotify-green)" : "white";
});

audio.addEventListener("ended", () => {
  if (isRepeat) {
    playSong();
  } else {
    nextSong();
  }
});

audio.addEventListener("timeupdate", updateProgress);

progressSlider.addEventListener("input", () => {
  if (audio.duration) {
    audio.currentTime = (progressSlider.value / 100) * audio.duration;
  }
});

// --- Initialize ---
loadSong(currentIndex);
pauseSong();
