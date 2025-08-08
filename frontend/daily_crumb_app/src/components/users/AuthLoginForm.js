import React, { useState } from 'react';

const AuthLoginForm = (props) => {

    const [enteredFormData, setEnteredFormData] = useState({
        email: "",
        password: ""
    })

    const changeHandler = (event) => {
        const { name, value } = event.target;

        setEnteredFormData(prevData => ({
            ...prevData,
            [name]: value
        }));

    }


    const submitHandler = (event) => {
        event.preventDefault();

        const userAttemptDataPosting = {
            email: enteredFormData.email,
            password: enteredFormData.password
        }

        props.loginHandler(userAttemptDataPosting);



    };

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisiblity = () => {
        setShowPassword(prevShowPassword => !prevShowPassword)
    }
    return (
        <form onSubmit={submitHandler} className="bg-white p-8 rounded-lg shadow-xl max-w-sm mx-auto mt-10">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>
            <div className="mb-4">
                <label htmlFor='email'
                    className="block text-gray-700 text-sm font-bold mb-2">
                    Email
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    type='email'
                    required
                    id='email'
                    name='email'
                    value={enteredFormData.email}
                    onChange={changeHandler}
                />
            </div>
            <div className="mb-6">
                <label htmlFor='password'
                    className="block text-gray-700 text-sm font-bold mb-2">
                    Password
                </label>
                <div className="relative">
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        type={showPassword ? 'text' : 'password'}
                        required
                        id='password'
                        name='password'
                        value={enteredFormData.password}
                        onChange={changeHandler}
                    />
                    <button
                        type='button'
                        onClick={togglePasswordVisiblity}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-600"
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                </div>
            </div>
            <div>
                <button
                    type='submit'
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Login
                </button>
            </div>
        </form>
    );
};

export default AuthLoginForm;