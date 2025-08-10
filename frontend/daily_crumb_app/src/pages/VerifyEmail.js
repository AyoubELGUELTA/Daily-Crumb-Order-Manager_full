import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";



const VerifyEmail = ({ onVerificationSuccess }) => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const [backendResp, setBackendResp] = useState('');

    const [isVerifyingSuccessful, setIsVerifyingSuccessful] = useState(false);

    const urlParams = new URLSearchParams(window.location.search);

    const token = urlParams.get('token');

    const [goToHomeButton, setGoToHomeButton] = useState({
        span: '',
        text: 'Click here to start cooking!'

    });
    useEffect(() => {


        const emailVerifyingHandler = async () => {
            setIsVerifyingSuccessful(false);
            setIsLoading(true);

            if (!token) {
                setBackendResp("Error: Checking token is missing.");
                setIsLoading(false);
                return;
            }

            try {


                const response = await fetch(`/users/verifyEmail?token=${token}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )


                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Error occured.");
                }


                console.log('Verification was successful', data);
                const sessionToken = data.token;

                if (onVerificationSuccess) {
                    onVerificationSuccess(sessionToken);
                }
                setIsVerifyingSuccessful(true);
                setBackendResp(data.message);



            }
            catch (error) {
                console.error('Error during verification:', error);
                setIsVerifyingSuccessful(false);
                setBackendResp(error.message || "Error not identified occured.");
            }
            finally {
                setIsLoading(false);
            };
        }
        emailVerifyingHandler();
    }, [token, onVerificationSuccess]);

    const handleOnClick = () => {
        setGoToHomeButton(prev => ({
            ...prev,
            text: 'Loading'
        }));
        setGoToHomeButton(prev => ({
            ...prev,
            span: 'loading loading-infinity'
        }));

        setTimeout(() => {
            navigate("/homeCooking");
        }, 1000);



    }


    return (

        < div >
            {
                !isLoading ?
                    <div className="bg-white p-8 rounded-lg shadow-xl text-center">

                        < p className="text-xl font-italic mb-8" > {backendResp}</p >
                    </div >
                    :

                    <div className="fixed inset-0 flex items-center justify-center z-[90]">

                        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm"></div>

                        <span className='loading loading-infinity loading-xl z-[100]'></span>

                    </div>}



            {(!isLoading && isVerifyingSuccessful) &&
                <div>
                    {!goToHomeButton.span ?


                        <div className="flex items-center justify-center h-screen">
                            <button onClick={handleOnClick} className="btn btn-wide btn-neutral btn-outline">
                                {goToHomeButton.text}

                            </button>
                        </div>
                        :
                        <div className="flex items-center justify-center h-screen">
                            <button className="btn btn-wide btn-neutral btn-outline">
                                {goToHomeButton.text}
                                <span className="loading loading-infinity loading-xl"></span>
                            </button>
                        </div>

                    }
                </div>}



        </div >
    );
};

export default VerifyEmail;










