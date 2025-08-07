import { useState } from 'react';
// import TimedParagraph from './utilities/TimedParagraph'; exemple d'utilisation de useEffect.
const AuthSignupForm = (props) => {

    const [enteredFormData, setEnteredFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        role: "Employee",
        keyRole: ""

    })






    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisiblity = () => {
        setShowPassword(prevShowPassword => !prevShowPassword)
    }


    const [formError, setFormError] = useState("");



    const changeHandler = (event) => {
        const { name, value } = event.target;

        setEnteredFormData(prevData => {
            const updatedData = {
                ...prevData,
                [name]: value
            }


            if (name === "password" || name === "confirmPassword") {
                if (updatedData.password !== updatedData.confirmPassword) {
                    setFormError("Passwords are not matching.");
                } else {
                    setFormError("");
                }
            }

            return updatedData;
        });
    }

    const submitHandler = (event) => {
        event.preventDefault();

        if (!(enteredFormData.password === enteredFormData.confirmPassword)) {
            setFormError("Passwords are not matching.")
            return
        }

        setFormError("")

        const userAttemptDataPosting = {
            email: enteredFormData.email,
            password: enteredFormData.password,
            name: enteredFormData.name || "Unknown",
            role: enteredFormData.role,
            keyRole: enteredFormData.keyRole

        }

        props.signupHandler(userAttemptDataPosting);



    };

    return (
        <form onSubmit={submitHandler} className="bg-white p-8 rounded-lg shadow-xl max-w-sm mx-auto mt-10">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Signup</h2>
            <div className="mb-4">
                <label htmlFor='email' className="block text-gray-700 text-sm font-bold mb-2">Email</label>
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
                <label htmlFor='password' className="block text-gray-700 text-sm font-bold mb-2">Password</label>
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

            <div className="mb-6">
                <label htmlFor='confirmPassword' className="block text-gray-700 text-sm font-bold mb-2">Password confirmation</label>
                <div className="relative">
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        type='password'
                        required
                        id='confirmPassword'
                        name='confirmPassword'
                        value={enteredFormData.confirmPassword}
                        onChange={changeHandler}
                    />
                </div>
            </div>

            <div className="mb-6">
                <label htmlFor='name' className="block text-gray-700 text-sm font-bold mb-2">Name (optionnal)</label>
                <div className="relative">
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        type='text'
                        id='name'
                        name='name'
                        value={enteredFormData.name}
                        onChange={changeHandler}
                    />

                </div>

            </div>

            <div className="mb-6">
                <label htmlFor='employee' className="flex items-center text-gray-700">
                    <input
                        type='radio'
                        id='employee'
                        name='role'
                        value='Employee'
                        checked={enteredFormData.role === 'Employee'}
                        onChange={changeHandler}
                        className="mr-2"
                    />
                    Employee
                </label>

                {/* Bouton radio pour 'Admin' */}
                <label htmlFor='admin' className="flex items-center text-gray-700">
                    <input
                        type='radio'
                        id='admin'
                        name='role'
                        value='Admin'
                        checked={enteredFormData.role === 'Admin'}
                        onChange={changeHandler}
                        className="mr-2"
                    />
                    Admin
                </label>

            </div>

            <div className="mb-6">
                <label htmlFor='keyRole' className="block text-gray-700 text-sm font-bold mb-2">Role Key (required)</label>
                <div className="relative">
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        type='text'
                        id='keyRole'
                        name='keyRole'
                        value={enteredFormData.keyRole}
                        onChange={changeHandler}
                    />

                </div>

            </div>

            {/* Affichage du message d'erreur si l'état formError n'est pas vide */}
            {formError && (
                <p style={{ color: 'red' }}>{formError}</p>
            )}


            <div>
                <button
                    type='submit'
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Signup
                </button>
            </div>
        </form>
    );
};

export default AuthSignupForm;