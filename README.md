# 🔔 Push Notification POC - MERN Stack

A complete Proof of Concept for implementing Web Push Notifications using the MERN stack.

## Features

- ✅ Web Push Notifications API
- ✅ Service Worker implementation
- ✅ MongoDB subscription storage
- ✅ VAPID authentication
- ✅ Real-time notification sending
- ✅ Beautiful UI with React

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or connection string)
- Modern browser (Chrome, Firefox, Edge, Opera)

## Quick Start

### 1. Install Server Dependencies

```bash
cd server
npm install
```

### 2. Generate VAPID Keys

```bash
npm run generate-keys
```

Copy the generated keys and paste them into `server/.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/push-notifications
PORT=5000
VAPID_PUBLIC_KEY=<paste_your_public_key>
VAPID_PRIVATE_KEY=<paste_your_private_key>
VAPID_EMAIL=mailto:your-email@example.com
```

### 3. Start MongoDB

Make sure MongoDB is running:

```bash
mongod
```

### 4. Start the Server

```bash
npm run dev
```

Server will run on http://localhost:5000

### 5. Install Client Dependencies

Open a new terminal:

```bash
cd client
npm install
```

### 6. Start the Client

```bash
npm start
```

Application will open at http://localhost:3000

## How to Test

1. Open http://localhost:3000 in your browser
2. Click "Subscribe to Notifications"
3. Allow notifications when prompted
4. Enter a notification title and body
5. Click "Send Notification"
6. You should receive a push notification!

## Project Structure

```
push-notification-poc/
├── server/
│   ├── models/
│   │   └── Subscription.js
│   ├── .env
│   ├── .gitignore
│   ├── generateVapidKeys.js
│   ├── package.json
│   ├── server.js
│   └── README.md
├── client/
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── service-worker.js
│   ├── src/
│   │   ├── services/
│   │   │   └── notificationService.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── .gitignore
│   ├── package.json
│   └── README.md
└── README.md
```

## API Endpoints

- `GET /api/vapid-public-key` - Get VAPID public key
- `POST /api/subscribe` - Subscribe to notifications
- `POST /api/send-notification` - Send notification to all subscribers
- `DELETE /api/unsubscribe` - Unsubscribe from notifications
- `GET /api/subscriptions` - Get all subscriptions (testing)

## Technologies Used

### Backend
- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM
- web-push - Push notification library
- CORS - Cross-origin resource sharing

### Frontend
- React - UI library
- Axios - HTTP client
- Service Workers - Background sync
- Web Push API - Browser notifications

## Important Notes

- 🔒 HTTPS is required in production (localhost works for testing)
- 🌐 Browser support: Chrome, Firefox, Edge, Opera (not Safari on iOS)
- 📱 Notifications work even when browser is closed (if service worker is active
