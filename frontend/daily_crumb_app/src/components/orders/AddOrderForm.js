import React, { useState, useEffect } from 'react';

const AddClientForm = () => {
    const [orderFormData, setOrderFormData] = useState({
        clientEmail: "",
        deliveringDate: "",
    });



    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setOrderFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                setIsSuccess(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [isSuccess]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setIsSuccess(false);

        const [yyyy, mm, dd] = orderFormData.deliveringDate.split("-");
        const formattedDate = `${dd}/${mm}/${yyyy}`

        const payload = {
            ...orderFormData,
            deliveringDate: formattedDate,
        };

        try {

            const response = await fetch('/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || errorData.error || 'Error while trying to add the client.');
            }

            setOrderFormData({
                clientEmail: "",
                deliveringDate: "",
            });
            setIsSuccess(true);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center">Planning new order</h2>

                {/* Feedback messages */}
                {isLoading && (
                    <div className="fixed inset-0 flex items-center justify-center z-[90]">
                        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm"></div>
                        <p className="text-center text-blue-500 mb-4 z-[100]">Adding in progress...</p>
                        <span className='loading loading-infinity loading-xl z-[100]'></span>
                    </div>
                )}
                {isSuccess && <p className="text-center text-green-500 mb-4">Initialisation was successful! Go to manage clients to fill the order!</p>}
                {error && <p className="text-center text-red-500 mb-4">Error : {error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                        <legend className="fieldset-legend">Order-Planning-form</legend>

                        <label className="label">Client email (required)</label>
                        <input
                            id="clientEmail"
                            type="email"
                            name="clientEmail"
                            value={orderFormData.clientEmail}
                            onChange={handleOnChange}
                            className="input w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="ex. client@email.com"
                            required
                        />

                        <label className="label">Delivering date (required)</label>
                        <input
                            id="deliveringDate"
                            type="date"
                            name="deliveringDate"
                            value={orderFormData.deliveringDate}
                            onChange={handleOnChange}
                            className="input w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="ex. John Doe"
                        />


                    </fieldset>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 
                            ${isLoading
                                ? 'bg-indigo-300 cursor-not-allowed'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                            }`}
                    >
                        {isLoading ? 'Initialisation of the order...' : 'Execute order'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddClientForm;
