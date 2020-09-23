const coverArt = document.querySelector('img');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const music = document.querySelector('audio');
const progressContainer = document.getElementById('progress-container');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const prevBtn = document.getElementById('prev');
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');
const volumeBtn = document.getElementById('volume');
const volumeContainer = document.querySelector('.volume-container');
const volumeBar = document.querySelector('.volume-bar');

// check if playing
let isPlaying = false;
// check if muted
let isMuted = false;
// Starting volume
music.volume = 0.7;

// Play
function playSong() {
  isPlaying = true;
  playBtn.classList.replace('fa-play-circle', 'fa-pause-circle');
  playBtn.setAttribute('title', 'Pause');
  music.play();
}

// Pause
function pauseSong() {
  isPlaying = false;
  playBtn.classList.replace('fa-pause-circle', 'fa-play-circle');
  playBtn.setAttribute('title', 'Play');
  music.pause();
}

// Update DOM
function loadSong(song) {
  title.textContent = song.displayName;
  artist.textContent = song.artist;
  music.src = `music/${song.name}.mp3`;
  coverArt.src = `img/${song.name}.jpg`;
}

// Current Song
let songIndex = 0;

// Previous Song
function prevSong() {
  songIndex--;
  if (songIndex < 0) {
    songIndex = songs2.length - 1;
  }
  loadSong(songs2[songIndex]);
  playSong();
}
// Next Song
function nextSong() {
  songIndex++;
  if (songIndex > songs2.length - 1) {
    songIndex = 0;
  }
  loadSong(songs2[songIndex]);
  playSong();
}

// Volume Control
function toggleMute() {
  if (isMuted === false) {
    music.muted = true;
    isMuted = true;
    volumeBtn.classList.replace('fa-volume-up', 'fa-volume-mute');
  } else if (isMuted) {
    music.muted = false;
    isMuted = false;
    volumeBtn.classList.replace('fa-volume-mute', 'fa-volume-up');
  }
}
function setVolumeBar(e) {
  // UI volume bar feedback
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const volumePercentage = (clickX / width) * 100;
  volumeBar.style.width = `${volumePercentage}%`;
  // Connect to audio element volume
  const volumeRange = volumePercentage / 100;
  music.volume = volumeRange;
}

// On Load - Select first song
loadSong(songs2[songIndex]);

// Update progress bar and time
function updateProgressBar(e) {
  if (isPlaying) {
    const { duration, currentTime } = e.srcElement;
    const progressPercentage = (currentTime / duration) * 100;
    progress.style.width = `${progressPercentage}%`;
    // Calc display for duration
    const durationMinutes = Math.floor(duration / 60);
    let durationSeconds = Math.floor(duration % 60);
    if (durationSeconds < 10) {
      durationSeconds = `0${durationSeconds}`;
    }
    // Delay switching duration Element to avoid NaN
    if (durationSeconds) {
      durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
    }
    // Calc display for current
    const currentMinutes = Math.floor(currentTime / 60);
    let currentSeconds = Math.floor(currentTime % 60);
    if (currentSeconds < 10) {
      currentSeconds = `0${currentSeconds}`;
    }
    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
  }
}

// Set Progress Bar
function setProgressBar(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const { duration } = music;
  const songProgress = (clickX / width) * duration;
  music.currentTime = songProgress;
}

// EVENT LISTENERS

// Play or Pause Event Listener
playBtn.addEventListener('click', () => {
  isPlaying ? pauseSong() : playSong();
});
// Prev/Next
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
// Volume adjustment
volumeBtn.addEventListener('click', toggleMute);
// Go to next song when current song ends
music.addEventListener('ended', nextSong);
// Update progress bar
music.addEventListener('timeupdate', updateProgressBar);
// Click on progress bar to skip around in current track
progressContainer.addEventListener('click', setProgressBar);
// Click on Volume container to change volume
volumeContainer.addEventListener('click', setVolumeBar);
