# Chat Application

This is a real-time chat application built with Node.js, Express, Socket.io, and a Python Flask server for AI-based text predictions. The app allows users to join chat rooms, send text messages, share files, and send voice recordings.

## Features

- **Real-time messaging**: Chat with others in real-time using Socket.io.
- **File sharing**: Upload and share files within the chat.
- **Voice messages**: Record and send voice messages.
- **Text predictions**: AI-powered text prediction using a Flask server with GPT-2.
- **User management**: Join specific chat rooms and see who else is in the room.

## Prerequisites

- Node.js (v14 or higher)
- Python (v3.7 or higher)
- npm (Node Package Manager)
- Virtual Environment (for Python dependencies)

## Getting Started

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/chat-app.git](https://github.com/mostafasalama97/CHAT_APP_WEB_SOCKET.git)
cd chat-app
```

## 2. Setup the Node.js Server
### 1. Navigate to the server directory:
```bash
cd server
```
### 2. Install the required dependencies:
```bash
npm install
```
### 3. Start the Node.js server:
```bash
npm run dev
```

## 3. Setup the Python Flask Server
### 1. Navigate to the Flask server directory:
```bash
cd ai-model-prediction
```
### 2. Create and activate a virtual environment:
```bash
python -m venv myenv
source myenv/bin/activate  # On Windows use `myenv\Scripts\activate`
```
### 3. Install the required Python dependencies:
```bash
pip install -r requirements.txt
```
### 4. Start the Flask server:
```bash
python predict.py
```

## 4. Run the Application
### 1. Open your web browser and navigate to:
```bash
http://localhost:5500/server/public/index.html
```
### 2. Join a chat room, and start chatting, sharing files, or sending voice messages.

## API Endpoints

### Flask Server

- **POST /predict**
  - **Request:** 
    ```json
    { "input_text": "your input text" }
    ```
  - **Response:** 
    ```json
    { "predicted_text": "predicted output text" }
    ```

### Node.js Server

- **POST /upload**
  - **Request:** File upload via `multipart/form-data`
  - **Response:** 
    ```json
    { "filePath": "/uploads/yourfile.ext" }
    ```

## Usage

- **Join a chat room:** Enter your name and the chat room you'd like to join. You can see the list of users and active rooms.
- **Send a message:** Type your message and click 'Send' to chat with others in real-time.
- **File sharing:** Select a file to upload and share within the chat.
- **Voice messages:** Record and send a voice message using the 'Start Recording' and 'Stop Recording' buttons.
- **Text predictions:** Get AI-powered text suggestions as you type.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

