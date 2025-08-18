// Dans /config/firebase-admin-config.js
const admin = require('firebase-admin');

const serviceAccount = require('../../firebase-service-account.json');

// Vérifiez si l'application a déjà été initialisée avant de la créer
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
}

module.exports = admin;