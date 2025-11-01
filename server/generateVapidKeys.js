const webpush = require('web-push');

const vapidKeys = webpush.generateVAPIDKeys();

console.log('\n=================================');
console.log('VAPID Keys Generated Successfully!');
console.log('=================================\n');
console.log('Public Key:');
console.log(vapidKeys.publicKey);
console.log('\nPrivate Key:');
console.log(vapidKeys.privateKey);
console.log('\n⚠️  IMPORTANT: Copy these keys to your .env file!\n');
