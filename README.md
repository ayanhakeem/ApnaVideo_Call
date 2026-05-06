# 🎬 Apna Video Call: Cinematic Video Conferencing

Apna Video Call is a high-performance, premium video conferencing application built with the MERN stack, WebRTC, and Socket.io. It features a stunning "Cinematic" design system with glassmorphism, fluid animations, and a focus on visual excellence.

![App Preview](https://images.unsplash.com/photo-1616587226960-4a03badbe8bf?auto=format&fit=crop&q=80&w=1000)

## ✨ Features

- **🎥 High-Quality Video/Audio**: Reliable peer-to-peer communication powered by WebRTC.
- **🖥️ Screen Sharing**: Seamlessly share your screen with other participants in real-time.
- **💬 Real-time Chat**: Integrated messaging system with a sleek, semi-transparent UI.
- **🛡️ Guest Join**: Join meetings instantly via session ID without needing an account.
- **📜 Meeting History**: Securely log and track your past neural transmissions (for registered users).
- **🎨 Cinematic UI**: A state-of-the-art design system featuring:
  - Aurora backgrounds and fluid WebGL-style effects.
  - Premium glassmorphism and micro-animations.
  - Responsive layouts for all device types.

## 🚀 Tech Stack

- **Frontend**: React.js, Material UI, Lucide/Feather Icons
- **Backend**: Node.js, Express.js
- **Real-time**: Socket.io (Signaling & Chat)
- **Communication**: WebRTC (P2P Media Streams)
- **Database**: MongoDB (User Data & History)
- **Styling**: Vanilla CSS (CSS Modules)

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/ayanhakeem/ApnaVideo_Call.git
cd ApnaVideo_Call
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=8000
MONGO_URL=your_mongodb_connection_string
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

### 4. Run the Application
Start the Backend:
```bash
cd backend
npm run dev
```

Start the Frontend:
```bash
cd frontend
npm start
```

## 📖 Usage

1.  **Launch the App**: Open `http://localhost:3000` in your browser.
2.  **Join as Guest**: Click "Join Session" in the navbar and enter any code.
3.  **Sign Up/Login**: Create an account to access your personal meeting history.
4.  **Meeting Controls**: Use the control bar to toggle Camera, Microphone, Screen Sharing, and Chat.

## 🛡️ License

This project is licensed under the ISC License.

---
Created with ❤️ for the next generation of digital spatial communication.
