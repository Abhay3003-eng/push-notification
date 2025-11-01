/* eslint-disable no-restricted-globals */

// Install event
self.addEventListener('install', (event) => {
    console.log('Service Worker installed');
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('Service Worker activated');
});

// Push event - received when notification is sent
self.addEventListener('push', (event) => {
    console.log('Push notification received', event);

    let data = {
        title: 'New Notification',
        body: 'You have a new notification!',
        icon: '/logo192.png',
        badge: '/logo192.png'
    };

    if (event.data) {
        data = event.data.json();
    }

    const options = {
        body: data.body,
        icon: data.icon || '/logo192.png',
        badge: data.badge || '/logo192.png',
        vibrate: [200, 100, 200],
        data: {
            url: data.url || '/',
            dateOfArrival: Date.now()
        },
        actions: [
            {
                action: 'explore',
                title: 'View',
            },
            {
                action: 'close',
                title: 'Close',
            },
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked', event);

    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    } else if (event.action === 'close') {
        event.notification.close();
    } else {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});
