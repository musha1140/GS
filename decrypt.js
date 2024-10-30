document.getElementById("decryptButton").addEventListener("click", async function () {
  const fileInput = document.getElementById("encryptedImage").files[0];
  const decryptionKey = document.getElementById("decryptionKey").value;

  if (!fileInput || !decryptionKey) {
    alert("Please select a file and enter the decryption key.");
    return;
  }
  function extractEncryptedMessage(svgContent) {
    const encryptedMatch = svgContent.match(/<!--ENCRYPTED:\s(.*?)-->/);
    return encryptedMatch ? encryptedMatch[1] : null;
}

async function decryptSVG(svgContent) {
    const encryptedMessage = extractEncryptedMessage(svgContent);
    if (encryptedMessage) {
        const decrypted = CryptoJS.AES.decrypt(encryptedMessage, encryptionKey, { iv: ivVector });
        return decrypted.toString(CryptoJS.enc.Utf8);
    } else {
        throw new Error("Encrypted message not found in SVG.");
    }
}
  const fileContent = await readFileAsText(fileInput);

  // Extract encrypted message from the SVG comment
  const encryptedMessage = extractEncryptedMessage(fileContent);
  if (!encryptedMessage) {
    alert("No encrypted message found in the file.");
    return;
  }

  // Decrypt the message
  const decryptedMessage = decryptMessage(encryptedMessage, decryptionKey);

  // Display the decrypted message
  document.getElementById("decryptedMessage").textContent = decryptedMessage || "Decryption failed. Check the key and try again.";
});

// Reads the file content as text
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}

// Extracts the encrypted message from SVG comment
function extractEncryptedMessage(content) {
  const commentStart = content.indexOf("<!--");
  const commentEnd = content.indexOf("-->", commentStart);
  return content.substring(commentStart + 4, commentEnd).trim(); // Extracts the message within <!-- -->
}

// Decrypts the Base64 encrypted message using AES
function decryptMessage(encryptedMessage, key) {
  try {
    const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
    const iv = CryptoJS.enc.Utf8.parse("your-iv-12345678"); // Use a consistent IV as per encryption settings
    const decrypted = CryptoJS.AES.decrypt(encryptedMessage, keyUtf8, { iv: iv });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}

// Clear Local Storage
document.getElementById("clearStorageButton").addEventListener("click", function () {
  localStorage.clear();
  alert("Local storage cleared.");
});