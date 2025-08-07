import React from 'react';
import AuthLoginForm from '../components/users/AuthLoginForm';

const AuthPageLogin = () => {

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



    return (
        <div>

            <AuthLoginForm loginHandler={loginHandler} />

        </div>


    );

};
export default AuthPageLogin;