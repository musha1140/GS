 const midiFiles = [
    "https://irp.cdn-website.com/cee417da/audio/Tetris_-_A_Theme.mid",
    "https://irp.cdn-website.com/cee417da/audio/Ramin_Djawadi_-_Westworld_Theme.mid",
    "https://irp.cdn-website.com/cee417da/audio/CornChaseIntersteller.mid",
    "https://irp.cdn-website.com/cee417da/audio/Dada_Life_-_Happy_Violence.mid",
    "https://irp.cdn-website.com/cee417da/audio/DancingQueen_(1).mid",
    "https://irp.cdn-website.com/cee417da/audio/GoodRiddance(TimeOfYourLife)(3).mid",
    "https://irp.cdn-website.com/cee417da/audio/Death_Note_-_L-s_Theme.mid",
    "https://irp.cdn-website.com/cee417da/audio/Bohemian-Rhapsody-1.mid",
    "https://irp.cdn-website.com/cee417da/audio/OnlyTime.mid",
    "https://irp.cdn-website.com/cee417da/audio/Holding-Out-For-A-Hero-1.mid",
    "https://irp.cdn-website.com/cee417da/audio/Hypnotize_(2).mid",
  ];
        const ROWS = 8;
        const COLUMNS = 8;
        let gameboard = Array(ROWS).fill().map(() => Array(COLUMNS).fill(false));
        let typingStartTime, typingEndTime, wpmValue = 0, currentMessage = '';

        document.addEventListener("DOMContentLoaded", initializeGameboard);

        document.getElementById("typingInput").addEventListener("input", function() {
            if (!typingStartTime) typingStartTime = new Date().getTime();
            typingEndTime = new Date().getTime();
            const typedText = document.getElementById("typingInput").value;
            currentMessage = typedText;
            calculateWPM();
        });

        function calculateWPM() {
            const typedText = document.getElementById("typingInput").value.trim().split(/\s+/).length;
            const timeDiff = (typingEndTime - typingStartTime) / 60000;
            wpmValue = (typedText / timeDiff).toFixed(2);
            document.getElementById("wpmCounter").innerText = `WPM: ${wpmValue}`;
        }

        function generateSecureKey() {
            return CryptoJS.lib.WordArray.random(16).toString();
        }

        document.getElementById("generateKeyButton").addEventListener("click", function () {
            const key = generateSecureKey();
            document.getElementById("encryptionKey").value = key;
        });

        document.getElementById("copyKeyButton").addEventListener("click", function () {
            const key = document.getElementById("encryptionKey").value;
            navigator.clipboard.writeText(key).then(() => {
                alert("Encryption key copied to clipboard!");
            });
        });

        function toggleCell(row, col) {
            gameboard[row][col] = !gameboard[row][col];
        }

        function updateGameboardXOR(binaryMessage) {
            const cells = document.querySelectorAll(".cell");
            for (let i = 0; i < cells.length; i++) {
                const bit = binaryMessage[i % binaryMessage.length];
                cells[i].classList.toggle('on', bit === '1');
                cells[i].classList.toggle('off', bit === '0');
            }
        }

        function playMIDI(songNumber) {
            Tone.start().then(() => {
                loadMIDIFile(songNumber)
                    .then(midi => {
                        const synth = new Tone.PolySynth(Tone.Synth).toDestination();
                        midi.tracks.forEach(track => {
                            track.notes.forEach(note => {
                                Tone.Transport.schedule(time => {
                                    synth.triggerAttackRelease(note.name, note.duration, time);
                                    const xorResult = applyXOR(currentMessage, note.name);
                                    const binaryMessage = xorResult.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join('');
                                    updateMatrix(binaryMessage, false);
                                    updateGameboardXOR(binaryMessage);
                                }, note.time);
                            });
                        });
                        Tone.Transport.start();
                    })
                    .catch(error => console.error("Failed to load the MIDI file.", error));
            });
        }

        function loadMIDIFile(songNumber) {
            const midiFile = midiFiles[songNumber - 1];
            return fetch(midiFile)
                .then(response => response.arrayBuffer())
                .then(data => new Midi(data))
                .catch(error => console.error("Failed to load the MIDI file.", error));
        }

        function applyXOR(message, midiNote) {
            let xorResult = "";
            for (let i = 0; i < message.length; i++) {
                xorResult += String.fromCharCode(message.charCodeAt(i) ^ midiNote.charCodeAt(i % midiNote.length) ^ (i % wpmValue));
            }
            return xorResult;
        }

        document.getElementById("encryptButton").addEventListener("click", function () {
            const message = document.getElementById("typingInput").value;
            const songNumber = parseInt(document.getElementById("songNumber").value);

            if (!message || !songNumber || songNumber < 1 || songNumber > midiFiles.length) {
                alert("Please enter a message and select a valid song.");
                return;
            }

            currentMessage = message;
            playMIDI(songNumber);
        });

        document.getElementById("downloadButton").addEventListener("click", function () {
            const binaryMessage = currentMessage.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join('');
            const svgContent = `
            <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">
                <text x="10" y="40" font-size="24" fill="red">${binaryMessage}</text>
            </svg>
            <!-- Instructions: Rename this file as '.slayy' and upload to decrypt -->`;
            const blob = new Blob([svgContent], { type: "image/svg+xml" });
            saveAs(blob, "encrypted_image.svg");
        });

        function decryptMessage(encryptedMessage, midiNote, wpm) {
            let decryptedMessage = "";
            for (let i = 0; i < encryptedMessage.length; i++) {
                const shiftValue = i % wpm;
                decryptedMessage += String.fromCharCode(encryptedMessage.charCodeAt(i) ^ midiNote.charCodeAt(i % midiNote.length) ^ shiftValue);
            }
            return decryptedMessage;
        }

        document.getElementById("decompileButton").addEventListener("click", function() {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.slayy';
            fileInput.onchange = function(event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const content = e.target.result;
                        const svgContent = content.split('<!-- Instructions')[0];
                        const encryptedMessage = svgContent.match(/<text[^>]*>(.*?)<\/text>/)[1];
                        const decryptedMessage = decryptMessage(encryptedMessage, "note", wpmValue);
                        document.getElementById('ResultsText').value = decryptedMessage;
                        document.getElementById('Results').classList.remove("hidden");
                    };
                    reader.readAsText(file);
                }
            };
            fileInput.click();
        });

        function updateMatrix(binaryMessage, makeStatic) {
            const matrix = document.getElementById('matrix');
            matrix.innerHTML = '';
            const columns = Math.floor(matrix.offsetWidth / 20);
            const rows = Math.floor(matrix.offsetHeight / 20);
            let binaryIndex = 0;
            for (let i = 0; i < columns; i++) {
                const column = document.createElement('div');
                column.className = 'matrix-column';
                column.style.left = `${i * 20}px`;
                for (let j = 0; j < rows; j++) {
                    const span = document.createElement('span');
                    span.textContent = binaryMessage[binaryIndex % binaryMessage.length];
                    span.style.color = binaryMessage[binaryIndex % binaryMessage.length] === '0' ? 'red' : 'green';
                    if (!makeStatic) {
                        span.style.animationDelay = `${Math.random() * 1}s`;
                    } else {
                        span.style.animation = 'none';
                    }
                    column.appendChild(span);
                    binaryIndex++;
                }
                matrix.appendChild(column);
            }
        }

        function initializeGameboard() {
            const gameboardElement = document.getElementById("gameboard");
            gameboardElement.innerHTML = "";
            for (let i = 0; i < ROWS; i++) {
                for (let j = 0; j < COLUMNS; j++) {
                    const cell = document.createElement("div");
                    cell.classList.add("cell", "off");
                    cell.dataset.row = i;
                    cell.dataset.col = j;
                    cell.addEventListener('click', () => toggleCell(i, j));
                    gameboardElement.appendChild(cell);
                }
            }
        }
// Generate key and IV from XOR result
function generateEncryptionParameters(xorResultString) {
    const hash = CryptoJS.SHA256(xorResultString);
    encryptionKey = CryptoJS.enc.Hex.parse(hash.toString().substr(0, 32));
    ivVector = CryptoJS.enc.Hex.parse(hash.toString().substr(32, 32));
}

// Encrypt message
function encryptMessage(message) {
    return CryptoJS.AES.encrypt(message, encryptionKey, { iv: ivVector }).toString();
}

// Save encrypted message in SVG
document.getElementById("downloadButton").addEventListener("click", function() {
    const encryptedMessage = encryptMessage(currentMessage);
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">
        <text x="10" y="40" font-size="24">${binaryMessage}</text>
    </svg>\n<!--ENCRYPTED: ${encryptedMessage}-->`;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    saveAs(blob, "encrypted_image.slayy");
});


        // Initialize the gameboard when the page loads
window.onload = initializeGameboard;