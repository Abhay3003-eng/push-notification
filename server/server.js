const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const webpush = require('web-push');
require('dotenv').config();

const Subscription = require('./models/Subscription');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configure web-push with VAPID keys
webpush.setVapidDetails(
    process.env.VAPID_EMAIL,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes

// Get VAPID public key
app.get('/api/vapid-public-key', (req, res) => {
    res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

// Subscribe to push notifications
app.post('/api/subscribe', async (req, res) => {
    try {
        const subscription = req.body;
        
        // Save or update subscription in database
        await Subscription.findOneAndUpdate(
            { endpoint: subscription.endpoint },
            subscription,
            { upsert: true, new: true }
        );

        console.log('✅ New subscription saved');
        res.status(201).json({ message: 'Subscription saved successfully' });
    } catch (error) {
        console.error('❌ Error saving subscription:', error);
        res.status(500).json({ error: 'Failed to save subscription' });
    }
});

// Send notification to all subscribers
app.post('/api/send-notification', async (req, res) => {
    try {
        const { title, body, url } = req.body;

        const payload = JSON.stringify({
            title: title || 'New Notification',
            body: body || 'You have a new notification!',
            icon: '/logo192.png',
            badge: '/logo192.png',
            url: url || '/'
        });

        // Get all subscriptions
        const subscriptions = await Subscription.find();

        if (subscriptions.length === 0) {
            return res.json({ message: 'No subscribers found', results: [] });
        }

        console.log(`📤 Sending notifications to ${subscriptions.length} subscribers...`);

        const notificationPromises = subscriptions.map(async (sub) => {
            try {
                await webpush.sendNotification(sub, payload);
                return { success: true, endpoint: sub.endpoint };
            } catch (error) {
                console.error('❌ Error sending to:', sub.endpoint, error.message);
                
                // If subscription is no longer valid, remove it
                if (error.statusCode === 410) {
                    await Subscription.deleteOne({ endpoint: sub.endpoint });
                }
                
                return { success: false, endpoint: sub.endpoint, error: error.message };
            }
        });

        const results = await Promise.all(notificationPromises);
        const successCount = results.filter(r => r.success).length;

        console.log(`✅ Notifications sent: ${successCount}/${subscriptions.length}`);

        res.json({
            message: `Notifications sent to ${successCount}/${subscriptions.length} subscribers`,
            results
        });
    } catch (error) {
        console.error('❌ Error sending notifications:', error);
        res.status(500).json({ error: 'Failed to send notifications' });
    }
});

// Unsubscribe
app.delete('/api/unsubscribe', async (req, res) => {
    try {
        const { endpoint } = req.body;
        await Subscription.deleteOne({ endpoint });
        console.log('✅ Subscription removed');
        res.json({ message: 'Unsubscribed successfully' });
    } catch (error) {
        console.error('❌ Error unsubscribing:', error);
        res.status(500).json({ error: 'Failed to unsubscribe' });
    }
});

// Get all subscriptions (for testing)
app.get('/api/subscriptions', async (req, res) => {
    try {
        const subscriptions = await Subscription.find();
        res.json({ count: subscriptions.length, subscriptions });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API Endpoints:`);
    console.log(`   GET  /api/vapid-public-key`);
    console.log(`   POST /api/subscribe`);
    console.log(`   POST /api/send-notification`);
    console.log(`   GET  /api/subscriptions\n`);
});
