import { useState, useEffect, createContext, useContext } from 'react';

import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, updateDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const FirebaseProvider = ({ children }) => {

    const FirebaseContext = createContext(null);

    const useFirebase = () => useContext(FirebaseContext);

    const [firebaseServices, setFirebaseServices] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initFirebase = async () => {
            try {
                // Variables d'environnement de la plateforme
                /* eslint-disable no-undef */

                const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
                const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
                const platformAppId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

                // Initialisation des services Firebase
                const app = initializeApp(firebaseConfig);
                const auth = getAuth(app);
                const db = getFirestore(app);
                const storage = getStorage(app);

                // Authentification
                if (initialAuthToken) {
                    await signInWithCustomToken(auth, initialAuthToken);
                } else {
                    await signInAnonymously(auth);
                }

                setFirebaseServices({ app, auth, db, storage, platformAppId });
            } catch (err) {
                console.error("Erreur d'initialisation Firebase: ", err);
                setError("Erreur de connexion aux services. Veuillez réessayer.");
            } finally {
                setLoading(false);
            }
        };

        initFirebase();
    }, []);

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-[90]">
                <div className="fixed inset-0 bg-white/50 backdrop-blur-sm"></div>
                <p className="text-center text-blue-500 mb-4 z-[100]">Connexion aux services...</p>
                <span className='loading loading-infinity loading-xl z-[100]'></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                    <p className="text-xl font-bold mb-4">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <FirebaseContext.Provider value={firebaseServices}>
            {children}
        </FirebaseContext.Provider>
    );
};

export default FirebaseProvider;