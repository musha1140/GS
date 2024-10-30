// MIDI files array
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
let currentMessage = '';
let encryptionKey = null;
let ivVector = null;
let typingStartTime, typingEndTime;
let wpmValue = 0;

// Function to calculate Words Per Minute (WPM)
function calculateWPM() {
    const typedText = document.getElementById("typingInput").value.trim().split(/\s+/).length;
    const timeDiff = (typingEndTime - typingStartTime) / 60000; // Time difference in minutes
    wpmValue = (typedText / timeDiff).toFixed(2);
    document.getElementById("wpmCounter").innerText = `WPM: ${wpmValue}`;
}

// Event listener for typing input
document.getElementById("typingInput").addEventListener("input", function() {
    if (!typingStartTime) typingStartTime = new Date().getTime();
    typingEndTime = new Date().getTime();
    currentMessage = document.getElementById("typingInput").value;
    updateHeader(currentMessage);
});

// Function to update the dynamic header with alternating colors
function updateHeader(message) {
    const header = document.getElementById("dynamic-header");
    header.innerHTML = "";
    for (let i = 0; i < message.length; i++) {
        const span = document.createElement("span");
        span.textContent = message[i];
        span.style.color = i % 2 === 0 ? "red" : "green";
        header.appendChild(span);
    }
}

// Function to initialize the gameboard
function initializeGameboard() {
    const gameboardElement = document.getElementById("gameboard");
    gameboardElement.innerHTML = "";
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell", "w-12", "h-12", "bg-red-700", "flex", "items-center", "justify-center", "text-lg", "font-bold", "cursor-pointer");
            cell.dataset.row = i;
            cell.dataset.col = j;
            gameboardElement.appendChild(cell);
        }
    }
}

// Function to play the MIDI file and perform XOR operations
function playMIDI(songNumber) {
    const midiFile = midiFiles[songNumber - 1];
    document.getElementById("typingInput").disabled = true;
    document.getElementById("typing-area").classList.add("hidden");
    document.getElementById("songNumber").classList.add("faded");
    document.getElementById("encryptButton").classList.add("faded");

    fetch(midiFile)
        .then(response => response.arrayBuffer())
        .then(data => {
            const midi = new Midi(data);
            const synth = new Tone.PolySynth(Tone.Synth).toDestination();
            let lastNoteEndTime = 0;

            // Convert the message to binary
            let binaryMessage = '';
            for (let i = 0; i < currentMessage.length; i++) {
                binaryMessage += currentMessage.charCodeAt(i).toString(2).padStart(8, '0');
            }

            // Ensure the binary message is long enough
            const totalNotes = midi.tracks.reduce((sum, track) => sum + track.notes.length, 0);
            binaryMessage = binaryMessage.padEnd(totalNotes, '0').substring(0, totalNotes);

            let noteIndex = 0;
            let xorResultString = '';

            midi.tracks.forEach(track => {
                track.notes.forEach(note => {
                    const midiNumber = note.midi % 64;
                    const row = Math.floor(midiNumber / 8);
                    const col = midiNumber % 8;
                    Tone.Transport.schedule(time => {
                        synth.triggerAttackRelease(note.name, note.duration, time);
                        const xorResult = performXOROperation(row, col, binaryMessage.charAt(noteIndex));
                        xorResultString += xorResult;
                        noteIndex++;
                    }, note.time);

                    const noteEndTime = note.time + note.duration;
                    if (noteEndTime > lastNoteEndTime) {
                        lastNoteEndTime = noteEndTime;
                    }
                });
            });

            // After playback, generate encryption key and IV based on XOR result
            Tone.Transport.schedule(() => {
                generateEncryptionParameters(xorResultString);
                onMidiPlaybackFinished();
            }, lastNoteEndTime + 0.5);

            Tone.Transport.start();
        });
}

// Function to perform XOR operation and update the gameboard
function performXOROperation(row, col, messageBit) {
    const cellState = gameboard[row][col] ? 1 : 0;
    const xorResult = cellState ^ parseInt(messageBit);
    gameboard[row][col] = xorResult === 1;
    updateGameboardCell(row, col);
    return xorResult.toString();
}

// Function to update a specific cell in the gameboard
function updateGameboardCell(row, col) {
    const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
    cell.style.backgroundColor = gameboard[row][col] ? "green" : "red";
}

// Function to generate encryption key and IV based on XOR result
function generateEncryptionParameters(xorResultString) {
    // Generate a hash from the XOR result string to create a key and IV
    const hash = CryptoJS.SHA256(xorResultString);
    encryptionKey = CryptoJS.enc.Hex.parse(hash.toString(CryptoJS.enc.Hex).substr(0, 32)); // 128 bits key
    ivVector = CryptoJS.enc.Hex.parse(hash.toString(CryptoJS.enc.Hex).substr(32, 32)); // 128 bits IV
}

// Function called after MIDI playback finishes
function onMidiPlaybackFinished() {
    document.getElementById("typingInput").disabled = false;
    document.getElementById("Results").classList.remove("hidden");

    // Base64 encode the message
    const base64Message = btoa(currentMessage);
    document.getElementById("ResultsText").value = base64Message;

    document.getElementById("downloadButton").classList.remove("hidden");
    updateMatrixDisplay();
    document.getElementById("typing-area").classList.remove("hidden");
    document.getElementById("songNumber").classList.remove("faded");
    document.getElementById("encryptButton").classList.remove("faded");
}

// Function to update the matrix display with binary XOR data
function updateMatrixDisplay() {
    const binaryMessage = currentMessage.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join('');
    const matrix = document.getElementById('matrix');
    matrix.innerHTML = binaryMessage.split('').join('\n');
}

// Event listener for the "Encrypt and Play MIDI" button
document.getElementById("encryptButton").addEventListener("click", function() {
    const message = document.getElementById("typingInput").value;
    if (!message) {
        alert("Please type a message.");
        return;
    }
    const songNumber = parseInt(document.getElementById("songNumber").value);
    if (!songNumber || songNumber < 1 || songNumber > midiFiles.length) {
        alert("Please choose a valid song.");
        return;
    }
    calculateWPM();
    currentMessage = message + wpmValue; // Append WPM as padding
    updateHeader(currentMessage);
    playMIDI(songNumber);
});

// Event listener for the "Download SVG" button
document.getElementById("downloadButton").addEventListener("click", function() {
    if (!encryptionKey || !ivVector) {
        alert("Encryption parameters not set. Please play a song first.");
        return;
    }

    const binaryMessage = currentMessage.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join('');
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">
<text x="10" y="40" font-size="24" fill="red">${binaryMessage}</text>
</svg>`;

    const encryptedMessage = encryptMessage(currentMessage);

    // Create the full content with the encrypted message in the comment
    const fullContent = `${svgContent}\n<!--${encryptedMessage}-->`;

    // Use the base64 message as the filename
    const base64Message = btoa(currentMessage);
    const filename = `${base64Message}.svg`;

    const blob = new Blob([fullContent], { type: 'image/svg+xml;charset=utf-8' });
    saveAs(blob, filename);
});

// Function to encrypt the message using CryptoJS
function encryptMessage(message) {
    const encrypted = CryptoJS.AES.encrypt(message, encryptionKey, { iv: ivVector });
    return encrypted.toString();
}

// Event listener for the "Decompile SVG" button
document.getElementById("decompileButton").addEventListener("click", function() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.svg';
    fileInput.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                const encryptedMessageMatch = content.match(/<!--(.*?)-->/);
                if (encryptedMessageMatch) {
                    const encryptedMessage = encryptedMessageMatch[1];
                    const xorResultString = extractXORFromSVG(content);
                    generateEncryptionParameters(xorResultString);
                    const decryptedMessage = decryptMessage(encryptedMessage);
                    if (decryptedMessage) {
                        // Remove WPM padding
                        const originalMessage = decryptedMessage.slice(0, -wpmValue.length);
                        alert(`Decrypted Message: ${originalMessage}`);
                    } else {
                        alert('Failed to decrypt the message.');
                    }
                } else {
                    alert('No encrypted message found in the file.');
                }
            };
            reader.readAsText(file);
        }
    };
    fileInput.click();
});

// Function to extract XOR result string from the SVG content
function extractXORFromSVG(svgContent) {
    const binaryTextMatch = svgContent.match(/<text.*?>(.*?)<\/text>/);
    if (binaryTextMatch) {
        const binaryText = binaryTextMatch[1].replace(/\s+/g, '');
        return binaryText;
    }
    return '';
}

// Function to decrypt the message using CryptoJS
function decryptMessage(encryptedMessage) {
    try {
        const decrypted = CryptoJS.AES.decrypt(encryptedMessage, encryptionKey, { iv: ivVector });
        const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
        return decryptedText;
    } catch (error) {
        return null;
    }
}

// Initialize the gameboard
initializeGameboard();

