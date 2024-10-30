# MIDI - Advanced Encryption and Visualization

**Version:** 1.1  
**Author:** Gas-Lighting  
**© 2024 Gas-Lighting**

---

## **Overview**

MIDI is an innovative web application that combines user input, MIDI music, and advanced cryptography to create a unique, interactive experience. It employs a combination of XOR logic, gate functions, and cutting-edge technologies to generate a visual representation of encrypted data in real-time, culminating in a lossless binary image that encapsulates the encrypted message.

---

## **Features**

- **User Interaction**: Type a custom message and observe its influence on the encryption process.
- **Encryption Key Management**: Generate a secure encryption key or input your own for added security.
- **MIDI Integration**: Synchronize the encryption process with MIDI music playback.
- **Real-Time Visualization**: Witness the encryption unfold through a dynamic 8x8 grid and visual feedback.
- **Advanced Cryptography**: Utilizes three-input XOR operations, AES encryption, and per-character checksums for data integrity.
- **Lossless Binary Image Generation**: Produces a high-resolution image containing the encrypted data, split into halves for enhanced security.
- **Data Management**: Clear local storage at any time to manage cached data effectively.
- **Sleek UI/UX Design**: Features a modern, dark-themed interface with intuitive controls and visual feedback.

---

## **Technical Details**

### **Encryption Process**

- **Three-Input XOR Operation**: Combines the user's message, MIDI data, and encryption key using XOR logic.
- **Per-Character Checksums**: Calculates checksums for each character to validate data integrity.
- **Data Splitting**: The encrypted data is split into two halves:
  - **First Half**: Embedded into the generated image (index.html)
  - **Second Half**: Stored securely (e.g., in local storage).
- **AES Encryption**: Encrypts the combined data using AES encryption with the provided key.

### **Visualization**

- **8x8 Grid Representation**: Each cell represents a bit in the 64-bit data structure.
- **Color-Coded States**:
  - **Red** (`on`): Represents a true state.
  - **Green** (`xor`): Result of the XOR operation.
  - **Default** (`off`): Represents a false state.
- **Real-Time Updates**: The grid updates in sync with the MIDI playback, providing a visual representation of the encryption process.
- **Character Validation**: Encrypted message characters turn green upon successful validation, serving as a visual signature.

### **Lossless Binary Image Generation**

- **High-Resolution Image**: The final image encapsulates the encrypted data in a lossless format.
- **Data Embedding**: The first half of the encrypted data is embedded within the image.
- **Secure Storage**: The second half is stored securely and must be combined with the first half during decryption.

---

## **User Interface**

- **Dark Theme**: A sleek, dark-themed interface for optimal visual comfort.
- **Dynamic Header**: Displays the base32 encoded version of the user's message, padded with the calculated WPM.
- **Responsive Design**: Ensures consistent experience across various devices and screen sizes.
- **Interactive Elements**: Buttons and inputs are styled for clarity and ease of use.
- **Visual Feedback**: Real-time updates and animations enhance the user experience.
- **Footer**:
  - **README Link**: Access this informative README directly from the application.
  - **Copyright**

---

## **Usage Instructions**

1. **Type Your Message**: Enter your message in the textarea provided.
2. **Generate or Enter Encryption Key**: Use the "Generate Key" button or input your own key.
3. **Copy Key (Optional)**: Click "Copy Key" to copy the encryption key for safekeeping.
4. **Select a Song**: Choose a MIDI file from the dropdown menu.
5. **Encrypt and Play MIDI**: Click the "Encrypt and Play MIDI" button to start the encryption process and music playback.
6. **Observe the Visualization**: The screen will focus on the grid and dynamic header, displaying the real-time encryption process.
7. **Save the Encrypted Image**: Upon completion, an image file will be saved containing the first half of the encrypted data.
8. **Store the Second Half Securely**: The second half of the encrypted data is stored in your browser's local storage. Ensure you retrieve and store it securely if needed.
9. **Clear Local Storage**: Use the "Clear Local Storage" button if you wish to remove cached data.
10. **Access the README**: Click on the "README" link in the footer to learn more about the application.

---

## **Data Privacy**

Your data is processed locally within your browser. No personal data or messages are transmitted to any server. You have full control over your data, and you can clear the local storage at any time using the "Clear Local Storage" button.

---

## **Security Considerations**

- **Encryption Key**: Keep your encryption key secure. It is required for decryption.
- **Second Half of Data**: The second half of the encrypted data is essential for decryption. Ensure you store it securely.
- **No Private Information Revealed**: Even though part of the data is stored in plain sight, it cannot be used to reconstruct the original message without the second half and the encryption key.
- **Data Integrity**: Per-character checksums ensure data integrity and validate the decryption process.

---

## **Disclaimer**

This application is designed for educational and entertainment purposes. While it employs real encryption methods, it should not be used for securing sensitive or confidential information.

---

**© 2024 Gas-Lighting**
