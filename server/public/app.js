const socket = io('ws://localhost:3500');

const activity = document.getElementById('activity');
const msgInput = document.getElementById('messageInp');
const nameInput = document.getElementById('name');
const roomInput = document.getElementById('room');
const userList = document.querySelector('.user-list');
const roomList = document.querySelector('.room-list');
const chatDisplay = document.querySelector('.chat-display');
const startRecordingBtn = document.getElementById('startRecordingBtn');
const stopRecordingBtn = document.getElementById('stopRecordingBtn');
const fileInput = document.getElementById('fileInput');

let mediaRecorder;
let audioChunks = [];

fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:3500/upload', {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    socket.emit('file', { name: nameInput.value, filePath: data.filePath });
});

socket.on('file', ({ name, filePath }) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${name}:</strong> <a href="${filePath}" target="_blank">Download File</a>`;
    chatDisplay.appendChild(li);
});

// Audio recording setup
startRecordingBtn.addEventListener('click', () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();

            mediaRecorder.addEventListener('dataavailable', event => {
                audioChunks.push(event.data);
            });

            mediaRecorder.addEventListener('stop', () => {
                const audioBlob = new Blob(audioChunks);
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                audio.controls = true;

                const li = document.createElement('li');
                li.appendChild(audio);
                chatDisplay.appendChild(li);

                audioChunks = []; // Reset the chunks for the next recording
            });
        });
});

stopRecordingBtn.addEventListener('click', () => {
    mediaRecorder.stop();
});

// Function to fetch prediction from the Flask server
async function fetchPrediction(text) {
    const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input_text: text }),
    });
    const data = await response.json();
    return data.predicted_text;
}

function sendMessage(e) {
    e.preventDefault();
    if (msgInput.value && nameInput.value && roomInput.value) {
        socket.emit('message', {
            "name": nameInput.value,
            "text": msgInput.value
        });
        msgInput.value = '';
    }
    msgInput.focus();
}

function enterRoom(e) {
    e.preventDefault();
    if (nameInput.value && roomInput.value) {
        socket.emit('enterRoom', {
            "name": nameInput.value,
            "room": roomInput.value
        });
    }
}

document.getElementById("messageForm").addEventListener("submit", sendMessage);
document.querySelector(".form-join").addEventListener("submit", enterRoom);

nameInput.addEventListener('keypress', () => {
    socket.emit('activity', nameInput.value);
});

// Listen for messages
socket.on('message', (data) => {
    activity.textContent = '';
    const { name, text, time } = data;
    const li = document.createElement('li');

    if (name === nameInput.value) {
        li.className = 'post post--right';
    } else if (name !== 'admin') {
        li.className = 'post post--left';
    }

    li.innerHTML = `
        <div class="post__header">
            <span class="post__header--name">${name}</span>
            <span class="post__header--time">${time}</span>
        </div>
        <div class="post__text">${text}</div>
    `;

    chatDisplay.appendChild(li);
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
});

function showPredictionDropdown(predictedText) {
    const dropdown = document.getElementById('predictionDropdown');
    dropdown.innerHTML = ''; // Clear previous predictions

    const predictions = predictedText.split(' ');

    predictions.forEach(prediction => {
        const li = document.createElement('li');
        li.textContent = prediction;
        li.className = 'dropdown-item';

        li.addEventListener('click', () => {
            msgInput.value += prediction + ' ';
            dropdown.innerHTML = ''; // Clear the dropdown
            msgInput.focus();
        });

        dropdown.appendChild(li);
    });

    const rect = msgInput.getBoundingClientRect();
    dropdown.style.left = `${rect.left}px`;
    dropdown.style.top = `${rect.bottom}px`;
    dropdown.style.display = 'block';
}

// Hide the dropdown if the user clicks outside of it
document.addEventListener('click', (event) => {
    const dropdown = document.getElementById('predictionDropdown');
    if (!dropdown.contains(event.target) && event.target !== msgInput) {
        dropdown.style.display = 'none';
    }
});

msgInput.addEventListener('input', async () => {
    socket.emit('activity', nameInput.value);

    const currentText = msgInput.value;
    const predictedText = await fetchPrediction(currentText);

    showPredictionDropdown(predictedText);
});

let activityTimer;
socket.on('activity', (name) => {
    activity.textContent = `${name} is typing...`;
    clearTimeout(activityTimer);
    activityTimer = setTimeout(() => {
        activity.textContent = '';
    }, 3000);
});

socket.on('userlist', ({ users }) => {
    showUsers(users);
});

socket.on('roomList', ({ rooms }) => {
    showRooms(rooms);
});

function showUsers(users) {
    userList.textContent = '';
    if (users) {
        userList.innerHTML = `<em>Users in ${roomInput.value}:</em>`;
        users.forEach((user, i) => {
            userList.textContent += ` ${user.name}`;
            if (users.length > 1 && i !== users.length - 1) {
                userList.textContent += ",";
            }
        });
    }
}

function showRooms(rooms) {
    roomList.textContent = '';
    if (rooms) {
        roomList.innerHTML = '<em>Active Rooms:</em>';
        rooms.forEach((room, i) => {
            roomList.textContent += ` ${room}`;
            if (rooms.length > 1 && i !== rooms.length - 1) {
                roomList.textContent += ",";
            }
        });
    }
}
