import { useState } from 'react';
import AuthLoginForm from '../components/users/AuthLoginForm';
import AuthSignupForm from '../components/users/AuthSignupForm';
// import TimedParagraph from '../components/users/utilities/TimedParagraph';
const AuthPage = () => {

    const [signupStatus, setSignupStatus] = useState({
        isPosted: false,
        message: null
    });

    const loginHandler = (loginData) => {
        fetch(`/users/login`,
            {
                method: 'POST',
                body: JSON.stringify(loginData),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
            .then(response => {
                // You should handle the response here
                if (!response.ok) {
                    // Handle error responses, e.g., show an error message to the user
                    throw new Error('Login failed');
                }
                return response.json(); // Parse the JSON response
            })
            .then(data => {
                // Handle successful login data, e.g., store the auth token
                console.log('Login successful:', data);
            })
            .catch(error => {
                // Handle network errors or errors from the server
                console.error('Error during login:', error);
            });
    };

    const signupHandler = (signupData) => {
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
            });
    }


    const handleOverlayClick = () => {
        setSignupStatus({
            isSuccess: false,
            message: null
        });
    };


    return (
        <div className="flex flex-col md:flex-row justify-center items-start space-y-100 md:space-y-3 md:space-x-250 p-4 bg-gray-100 min-h-screen">
            <AuthLoginForm loginHandler={loginHandler} />
            <AuthSignupForm signupHandler={signupHandler} />

            {signupStatus.isPosted && (
                <div onClick={handleOverlayClick}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                    <div className="bg-white p-8 rounded-lg shadow-xl text-center">

                        <p className="text-xl font-bold mb-4">{signupStatus.message}</p>
                    </div>
                </div>
            )}
        </div>


    );

};

export default AuthPage;