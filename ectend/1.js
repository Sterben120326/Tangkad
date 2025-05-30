function openWebsite() {
  document.getElementById("introScreen").style.display = "none";
  document.getElementById("home").style.display = "block";
  document.getElementById("timer").style.display = "block";
  startTimer();
  loadNotes();
}

function goBack() {
  document.getElementById("home").style.display = "none";
  document.getElementById("introScreen").style.display = "block";
  document.getElementById("timer").style.display = "none";
}

function startTimer() {
  const philippineStart = new Date('2025-05-27T06:05:00+08:00');

  function updateTimer() {
    const now = new Date();
    const nowPH = new Date(
      now.toLocaleString('en-US', { timeZone: 'Asia/Manila' })
    );

    const diff = nowPH - philippineStart;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById("timer").innerText =
      `Since May 27, 2025 6:05 Am: ${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

// Letter Page
function openLetterPage() {
  document.getElementById("home").style.display = "none";
  document.getElementById("letterPage").style.display = "block";
  document.getElementById("timer").style.display = "none";
  loadNotes();
}

function goToHome() {
  document.getElementById("letterPage").style.display = "none";
  document.getElementById("voicePage").style.display = "none";
  document.getElementById("musicPage").style.display = "none";
  document.getElementById("home").style.display = "block";
  document.getElementById("timer").style.display = "block";
}

// Notes
const noteInput = document.getElementById("noteInput");
const notesDisplay = document.getElementById("notesDisplay");

function addNote() {
  const note = noteInput.value.trim();
  if (note.length === 0) return;

  let notes = JSON.parse(localStorage.getItem("sharedNotes")) || [];
  const newNote = {
    id: Date.now(),
    text: note
  };
  notes.push(newNote);
  localStorage.setItem("sharedNotes", JSON.stringify(notes));

  noteInput.value = "";
  loadNotes();
}

function deleteNote(id) {
  let notes = JSON.parse(localStorage.getItem("sharedNotes")) || [];
  notes = notes.filter(n => n.id !== id);
  localStorage.setItem("sharedNotes", JSON.stringify(notes));
  loadNotes();
}

function loadNotes() {
  const notes = JSON.parse(localStorage.getItem("sharedNotes")) || [];
  if (notes.length === 0) {
    notesDisplay.innerHTML = "<p>No notes yet. Write one above!</p>";
    return;
  }

  notesDisplay.innerHTML = notes.map(n => `
    <div class="note-item">
      <span>• ${n.text}</span>
      <button class="delete-btn" onclick="deleteNote(${n.id})">🗑️</button>
    </div>
  `).join('');
}

// Voice Mail
let mediaRecorder;
let audioChunks = [];

const recordButton = document.getElementById("recordButton");
const stopButton = document.getElementById("stopButton");
const voiceList = document.getElementById("voiceList");

recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);

function openVoicePage() {
  document.getElementById("home").style.display = "none";
  document.getElementById("voicePage").style.display = "block";
  document.getElementById("timer").style.display = "none";
  loadVoices();
}

function startRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
    audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
    });

    mediaRecorder.addEventListener("stop", () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      saveVoice(audioUrl);
    });

    recordButton.style.display = "none";
    stopButton.style.display = "inline-block";
  });
}

function stopRecording() {
  mediaRecorder.stop();
  recordButton.style.display = "inline-block";
  stopButton.style.display = "none";
}

function saveVoice(url) {
  let voices = JSON.parse(localStorage.getItem("voices")) || [];
  voices.push(url);
  localStorage.setItem("voices", JSON.stringify(voices));
  loadVoices();
}

function loadVoices() {
  const voices = JSON.parse(localStorage.getItem("voices")) || [];
  voiceList.innerHTML = "";
  voices.forEach((url, index) => {
    const audio = document.createElement("audio");
    audio.controls = true;
    audio.src = url;

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete this voice mail";
    deleteButton.classList.add("delete-btn");
    deleteButton.onclick = () => {
      voices.splice(index, 1);
      localStorage.setItem("voices", JSON.stringify(voices));
      loadVoices();
    };

    const container = document.createElement("div");
    container.appendChild(audio);
    container.appendChild(deleteButton);
    voiceList.appendChild(container);
  });
}

// Music Page
function openMusicPage() {
  document.getElementById("home").style.display = "none";
  document.getElementById("musicPage").style.display = "block";
  document.getElementById("timer").style.display = "none";
}
