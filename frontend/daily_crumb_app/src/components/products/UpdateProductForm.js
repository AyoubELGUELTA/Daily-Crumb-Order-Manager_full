import React, { useState, useEffect } from 'react';

const UpdateProductForm = ({ handleDeleteImage, onUpdateSuccess, id, name, price, images, onCancel }) => {
    const [productFormData, setProductFormData] = useState({
        id: id || '',
        name: name || '',
        price: price || '',
        images: images || []
    });

    const [newImages, setNewImages] = useState([]); // nouvelles images à uploader
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [deleteImageHover, SetDeleteImageHover] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setProductFormData({
            id: id || '',
            name: name || '',
            price: price || '',
            images: images || []
        });
    }, [id, name, price, images]);

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => setIsSuccess(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess]);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setProductFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        setNewImages(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setIsSuccess(false);

        try {
            const resUpdate = await fetch(`/products/${productFormData.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: productFormData.name,
                    price: parseFloat(productFormData.price)
                })
            });

            if (!resUpdate.ok) {
                const errData = await resUpdate.json();
                throw new Error(errData.message || "Error updating product info");
            }

            if (newImages.length > 0) {
                const formData = new FormData();
                newImages.forEach(file => formData.append("productImages", file));

                const resImages = await fetch(`/products/${productFormData.id}/images`, {
                    method: 'POST',
                    body: formData
                });

                if (!resImages.ok) {
                    const errData = await resImages.json();
                    throw new Error(errData.error || errData.message || "Error uploading images");
                }
            }

            setIsSuccess(true);
            onUpdateSuccess(); // déclenche le refresh
        } catch (err) {
            console.error("Error while updating product:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center">Update product</h2>

                {/* Feedback */}
                {isLoading && (
                    <div className="fixed inset-0 flex items-center justify-center z-[90]">
                        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm"></div>
                        <p className="text-center text-blue-500 mb-4 z-[100]">Update in process..</p>
                        <span className='loading loading-infinity loading-xl z-[100]'></span>
                    </div>
                )}
                {isSuccess && <p className="text-center text-green-500 mb-4">The update was successful !</p>}
                {error && <p className="text-center text-red-500 mb-4">Error : {error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                        <legend className="fieldset-legend">Updating Form</legend>

                        <label className="label">Name</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={productFormData.name}
                            onChange={handleOnChange}
                            className="input w-full p-3 border border-gray-300 rounded-lg"
                            required
                        />

                        <label className="label mt-4">Price</label>
                        <input
                            id="price"
                            type="number"
                            name="price"
                            value={productFormData.price}
                            onChange={handleOnChange}
                            className="input w-full p-3 border border-gray-300 rounded-lg"
                            required
                        />


                        <label className="label mt-4">Current images</label>
                        <div
                            onMouseEnter={() => SetDeleteImageHover(true)}
                            onMouseLeave={() => SetDeleteImageHover(false)}
                            className="flex gap-4 flex-wrap"
                        >
                            {images && images.length > 0 ? (
                                images.map((img) => (
                                    <div key={img.id} className="relative w-32 h-32">
                                        <img
                                            src={img.url}
                                            alt={img.altText}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                        {deleteImageHover && (
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteImage(img.id)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">No images yet.</p>
                            )}
                        </div>

                        <label className="label mt-4">New images</label>
                        <input
                            id="images"
                            type="file"
                            name="images"
                            onChange={handleImageChange}
                            className="file-input w-full max-w-xs"
                            multiple
                        />
                    </fieldset>

                    <div className="flex gap-2 mt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors duration-200
                                ${isLoading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                        >
                            {isLoading ? 'Updating...' : 'Update product'}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-3 px-4 rounded-lg font-semibold transition-colors duration-200 bg-gray-300 text-gray-800 hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProductForm;
