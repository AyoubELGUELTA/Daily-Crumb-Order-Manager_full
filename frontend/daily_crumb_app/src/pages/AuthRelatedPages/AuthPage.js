import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLoginForm from '../../components/users/AuthLoginForm';
import AuthSignupForm from '../../components/users/AuthSignupForm';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyAKA8j96I7karsLOQVONZczbOT8M1qf2KY",
    authDomain: "daily-crumb-uploads.firebaseapp.com",
    projectId: "daily-crumb-uploads",
    storageBucket: "daily-crumb-uploads.firebasestorage.app",
    messagingSenderId: "239161507344",
    appId: "1:239161507344:web:37938eede2745bc2d09495",
    measurementId: "G-RNPQ53ED7R"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);



// import TimedParagraph from '../components/users/utilities/TimedParagraph';
const AuthPage = () => {

    const [signupStatus, setSignupStatus] = useState({
        isPosted: false,
        message: null
    });

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false)
    const [loadingAttemptMessage, setLoadingAttemptMessage] = useState('');

    const loginHandler = (loginData) => {
        setIsLoading(true);
        fetch(`/users/login`,
            {
                method: 'POST',
                body: JSON.stringify(loginData),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
            .then(async response => {
                // Le corps de la réponse doit être lu, peu importe le statut.
                // On utilise "async/await" à l'intérieur du "then" pour plus de clarté.
                const data = await response.json();

                if (!response.ok) {
                    // Si la réponse n'est pas OK, on lance une erreur
                    // en incluant le message du backend
                    console.log(data, response);
                    setIsLoading(false);
                    throw new Error(data.message || "Une erreur est survenue.");
                }

                // Si tout est OK, on retourne les données pour le prochain "then"
                return data;
            })
            .then(async data => {
                // Handle successful login data, e.g., store the auth token
                console.log('Login successful:', data);
                const firebaseCustomToken = data.firebaseCustomToken;

                await signInWithCustomToken(auth, firebaseCustomToken);


                setLoadingAttemptMessage(data.message);
                setIsLoading(false);
                navigate('/homeCooking');


            })
            .catch(error => {
                // Handle network errors or errors from the server
                console.error('Error during login:', error);
                setLoadingAttemptMessage(error.message)
                setIsLoading(false);

            })

    };

    const signupHandler = (signupData) => {
        setIsLoading(true);
        fetch(`/users/signup`,
            {
                method: 'POST',
                body: JSON.stringify(signupData),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
            .then(async response => {
                // Le corps de la réponse doit être lu, peu importe le statut.
                // On utilise "async/await" à l'intérieur du "then" pour plus de clarté.
                const data = await response.json();

                if (!response.ok) {
                    // Si la réponse n'est pas OK, on lance une erreur
                    // en incluant le message du backend
                    console.log(data, response);
                    throw new Error(data.message || "Une erreur est survenue.");
                }

                // Si tout est OK, on retourne les données pour le prochain "then"
                return data;
            })
            .then(data => {
                console.log('The signup has been successfully done:', data);
                setSignupStatus({
                    isPosted: true,
                    message: data.message || "Signup has been successfully done, please check your mail to confirm your email"
                })
            })
            .catch(error => {
                // Handle network errors or errors from the server
                console.error('Error during signup:', error);
                setSignupStatus({
                    isPosted: true,
                    message: error.message || "Error while data was submitted, please try again."
                });
            }).finally(() => {
                setIsLoading(false);
            });
    }


    const handleOverlayClick = () => {
        setSignupStatus({
            isSuccess: false,
            message: null
        });
        setLoadingAttemptMessage('');
    };


    return (
        <div className="flex flex-col md:flex-row justify-center items-start space-y-100 md:space-y-3 md:space-x-250 p-4 bg-gray-100 min-h-screen">
            <AuthLoginForm loginHandler={loginHandler} />
            <AuthSignupForm signupHandler={signupHandler} />


            {isLoading &&

                <div className="fixed inset-0 flex items-center justify-center z-[90]">

                    <div className="fixed inset-0 bg-white/50 backdrop-blur-sm"></div>

                    <span className='loading loading-infinity loading-xl z-[100]'></span>

                </div>}
            {signupStatus.isPosted && (

                <div onClick={handleOverlayClick}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                    <div className="bg-white p-8 rounded-lg shadow-xl text-center">

                        <p className="text-xl font-bold mb-4">{signupStatus.message}</p>
                    </div>

                </div>

            )}
            {loadingAttemptMessage && (

                <div onClick={handleOverlayClick}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                    <div className="bg-white p-8 rounded-lg shadow-xl text-center">

                        <p className="text-xl font-bold mb-4">{loadingAttemptMessage}</p>
                    </div>

                </div>

            )}
        </div>


    );

};


export default AuthPage;