import axios from 'axios';

const API_URL = 'http://localhost:9000/api';

export const getPublicKey = async () => {
    const response = await axios.get(`${API_URL}/vapid-public-key`);
    return response.data.publicKey;
};

export const subscribeUser = async (subscription) => {
    const response = await axios.post(`${API_URL}/subscribe`, subscription);
    return response.data;
};

export const unsubscribeUser = async (endpoint) => {
    const response = await axios.delete(`${API_URL}/unsubscribe`, {
        data: { endpoint }
    });
    return response.data;
};

export const sendNotification = async (title, body, url) => {
    const response = await axios.post(`${API_URL}/send-notification`, {
        title,
        body,
        url
    });
    return response.data;
};

export const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js');
            console.log('Service Worker registered:', registration);
            return registration;
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            throw error;
        }
    } else {
        throw new Error('Service Workers not supported');
    }
};

export const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
};

// Convert base64 VAPID key to Uint8Array
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export const subscribeToPushNotifications = async () => {
    try {
        const registration = await registerServiceWorker();
        const permissionGranted = await requestNotificationPermission();

        if (!permissionGranted) {
            throw new Error('Notification permission denied');
        }

        const publicKey = await getPublicKey();
        const applicationServerKey = urlBase64ToUint8Array(publicKey);

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey
        });

        await subscribeUser(subscription.toJSON());
        
        return subscription;
    } catch (error) {
        console.error('Error subscribing to push notifications:', error);
        throw error;
    }
};
