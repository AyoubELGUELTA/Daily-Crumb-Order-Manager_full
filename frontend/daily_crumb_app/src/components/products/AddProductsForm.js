import React, { useState, useEffect } from 'react';

const AddProductsForm = () => {

    const [productFormData, setProductFormData] = useState({
        name: "",
        price: "",
        inStock: false
    });

    useEffect(() => {
        console.log('AddProductsForm est monté.');
        return () => {
            console.log('AddProductsForm va être démonté.');
        };
    }, []);

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setProductFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleInStockChange = () => {
        setProductFormData(prevState => ({
            ...prevState,
            inStock: !prevState.inStock
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

        try {

            const response = await fetch('/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productFormData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || errorData.error || 'Error while trying to add the product.');
            }

            setProductFormData({
                name: "",
                price: "",
                inStock: false
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
                <h2 className="text-3xl font-bold mb-6 text-center">Adding a new product</h2>

                {/* Messages de feedback */}
                {isLoading && (
                    <div className="fixed inset-0 flex items-center justify-center z-[90]">
                        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm"></div>
                        <p className="text-center text-blue-500 mb-4 z-[100]">Adding in progress...</p>
                        <span className='loading loading-infinity loading-xl z-[100]'></span>
                    </div>
                )}
                {isSuccess && <p className="text-center text-green-500 mb-4">The adding was succeessful!</p>}
                {error && <p className="text-center text-red-500 mb-4">Error : {error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                        <legend className="fieldset-legend">Product-adding-form</legend>

                        <label className="label">Name</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={productFormData.name}
                            onChange={handleOnChange}
                            className="input w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Nom (ex. Gâteau aux fraises)"
                            required
                        />

                        <label className="label">Price</label>
                        <input
                            id="price"
                            type="number"
                            name="price"
                            value={productFormData.price}
                            onChange={handleOnChange}
                            className="input w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Prix (ex. 10.99, 5,..)"
                            required
                        />
                        <div className='mt-5 flex items-center'>
                            <label className="inStock ">In stock</label>
                            <input
                                id="inStock"
                                name="inStock"
                                type="checkbox"
                                checked={productFormData.inStock}
                                onChange={handleInStockChange}
                                className="checkbox checkbox-xl ml-4"
                            />
                        </div>
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
                        {isLoading ? 'Adding product...' : 'Add product'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddProductsForm;
