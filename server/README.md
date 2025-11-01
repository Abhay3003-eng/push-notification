# Push Notification Server

## Setup

1. Install dependencies:
```bash
npm install
```

2. Generate VAPID keys:
```bash
npm run generate-keys
```

3. Copy the generated keys to `.env` file

4. Make sure MongoDB is running:
```bash
mongod
```

5. Start the server:
```bash
npm run dev
```

Server will run on http://localhost:5000
