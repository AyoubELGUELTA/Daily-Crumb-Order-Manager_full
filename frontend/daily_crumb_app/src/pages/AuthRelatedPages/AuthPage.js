import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLoginForm from '../../components/users/AuthLoginForm';
import AuthSignupForm from '../../components/users/AuthSignupForm';
import NavBar from '../../components/navigation/NavBar';



const AuthPage = () => {
    const [isOpen, setIsOpen] = useState(false); // for NavBar

    const [signupStatus, setSignupStatus] = useState({
        isPosted: false,
        message: null
    });
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [loadingAttemptMessage, setLoadingAttemptMessage] = useState('');

    const loginHandler = async (loginData) => {
        setIsLoading(true);
        setLoadingAttemptMessage('');

        try {
            const response = await fetch(`/users/login`, {
                method: 'POST',
                body: JSON.stringify(loginData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                console.error(data, response);
                throw new Error(data.message || "Une erreur est survenue.");
            }

            console.log('Login successful:', data);

            setLoadingAttemptMessage("Connexion réussie !");
            setIsLoading(false);

            // Redirigez l'utilisateur une fois que la connexion est établie
            navigate('/homeCooking');

        } catch (error) {
            console.error('Error during login:', error);
            setLoadingAttemptMessage(error.message);
            setIsLoading(false);
        }
    };

    const signupHandler = async (signupData) => {
        setIsLoading(true);
        setSignupStatus({ isPosted: false, message: null });

        try {
            const response = await fetch(`/users/signup`, {
                method: 'POST',
                body: JSON.stringify(signupData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                console.error(data, response);
                throw new Error(data.message || "Une erreur est survenue.");
            }

            console.log('The signup has been successfully done:', data);
            setSignupStatus({
                isPosted: true,
                message: data.message || "Signup has been successfully done, please check your mail to confirm your email."
            });

        } catch (error) {
            console.error('Error during signup:', error);
            setSignupStatus({
                isPosted: true,
                message: error.message || "Error while data was submitted, please try again."
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOverlayClick = () => {
        setSignupStatus({ isPosted: false, message: null });
        setLoadingAttemptMessage('');
    };

    return (
        <div className="flex flex-col md:flex-row justify-center items-start space-y-100 md:space-y-3 md:space-x-250 p-4 bg-gray-100 min-h-screen">
            <NavBar isOpen={isOpen} setIsOpen={setIsOpen} />

            <AuthLoginForm loginHandler={loginHandler} />
            <AuthSignupForm signupHandler={signupHandler} />

            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center z-[90]">
                    <div className="fixed inset-0 bg-white/50 backdrop-blur-sm"></div>
                    <span className='loading loading-infinity loading-xl z-[100]'></span>
                </div>
            )}
            {(signupStatus.isPosted || loadingAttemptMessage) && (
                <div onClick={handleOverlayClick}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                    <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                        <p className="text-xl font-bold mb-4">
                            {signupStatus.message || loadingAttemptMessage}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuthPage;    