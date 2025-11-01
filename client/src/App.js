import React, { useState, useEffect } from 'react';
import {
    subscribeToPushNotifications,
    sendNotification,
    requestNotificationPermission
} from './services/notificationService';
import './App.css';

function App() {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState('');
    const [notificationBody, setNotificationBody] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        checkSubscriptionStatus();
    }, []);

    const checkSubscriptionStatus = async () => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            try {
                const registration = await navigator.serviceWorker.ready;
                const subscription = await registration.pushManager.getSubscription();
                setIsSubscribed(subscription !== null);
            } catch (error) {
                console.error('Error checking subscription:', error);
            }
        }
    };

    const handleSubscribe = async () => {
        setLoading(true);
        setMessage('');
        
        try {
            await subscribeToPushNotifications();
            setIsSubscribed(true);
            setMessage('Successfully subscribed to push notifications!');
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSendNotification = async () => {
        if (!notificationTitle || !notificationBody) {
            setMessage('Please fill in both title and body');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const result = await sendNotification(notificationTitle, notificationBody, '/');
            setMessage(result.message);
            setNotificationTitle('');
            setNotificationBody('');
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleTestPermission = async () => {
        try {
            const granted = await requestNotificationPermission();
            setMessage(granted ? 'Permission granted!' : 'Permission denied');
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>🔔 Push Notification POC</h1>
                
                <div className="status">
                    Status: {isSubscribed ? 
                        <span className="subscribed">✅ Subscribed</span> : 
                        <span className="not-subscribed">❌ Not Subscribed</span>
                    }
                </div>

                <div className="button-group">
                    {!isSubscribed ? (
                        <>
                            <button 
                                onClick={handleTestPermission}
                                className="btn btn-secondary"
                            >
                                Test Permission
                            </button>
                            <button 
                                onClick={handleSubscribe}
                                disabled={loading}
                                className="btn btn-primary"
                            >
                                {loading ? 'Subscribing...' : 'Subscribe to Notifications'}
                            </button>
                        </>
                    ) : (
                        <div className="notification-form">
                            <h2>Send Test Notification</h2>
                            
                            <input
                                type="text"
                                placeholder="Notification Title"
                                value={notificationTitle}
                                onChange={(e) => setNotificationTitle(e.target.value)}
                                className="input"
                            />
                            
                            <textarea
                                placeholder="Notification Body"
                                value={notificationBody}
                                onChange={(e) => setNotificationBody(e.target.value)}
                                className="textarea"
                                rows="4"
                            />
                            
                            <button 
                                onClick={handleSendNotification}
                                disabled={loading}
                                className="btn btn-primary"
                            >
                                {loading ? 'Sending...' : 'Send Notification'}
                            </button>
                        </div>
                    )}
                </div>

                {message && (
                    <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                        {message}
                    </div>
                )}

                <div className="info">
                    <h3>Browser Support</h3>
                    <p>Service Worker: {'serviceWorker' in navigator ? '✅' : '❌'}</p>
                    <p>Push Manager: {'PushManager' in window ? '✅' : '❌'}</p>
                    <p>Notifications: {'Notification' in window ? '✅' : '❌'}</p>
                </div>
            </header>
        </div>
    );
}

export default App;
