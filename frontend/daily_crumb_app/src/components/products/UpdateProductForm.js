import React, { useState, useEffect } from 'react';



const { db, userId, appId, auth } = useFirebase();


// Variables de l'environnement de la plateforme
const platformAppId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Composant de mise à jour du produit
const UpdateProductForm = ({ onUpdateSuccess, id, name, price, imagesArray, onCancel }) => {
    // Initialise l'état du formulaire avec les données du produit existant
    const [productFormData, setProductFormData] = useState({
        id: id || '',
        name: name || '',
        price: price || '',
        images: imagesArray || []
    });
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setProductFormData({
            id: id || '',
            name: name || '',
            price: price || '',
            images: imagesArray || []
        });
    }, [id, name, price, imagesArray]);

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                setIsSuccess(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess]);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setProductFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setIsSuccess(false);

        try {
            if (initialAuthToken) {
                await signInWithCustomToken(auth, initialAuthToken);
            } else {
                await signInAnonymously(auth);
            }

            const userId = auth.currentUser?.uid;
            if (!userId) {
                throw new Error("Impossible d'obtenir l'ID de l'utilisateur.");
            }

            let uploadedImageUrls = [];

            if (images.length > 0) {
                const uploadPromises = images.map(async (file) => {
                    const storageRef = ref(storage, `products/${userId}/${file.name}`);
                    await uploadBytes(storageRef, file);
                    return getDownloadURL(storageRef);
                });
                const urls = await Promise.all(uploadPromises);
                uploadedImageUrls.push(...urls);
            }

            const productDocRef = doc(db, `/artifacts/${platformAppId}/users/${userId}/products`, id);

            const updateData = {
                name: productFormData.name,
                price: parseFloat(productFormData.price),
                updatedAt: new Date().toISOString()
            };

            if (uploadedImageUrls.length > 0) {
                updateData.images = uploadedImageUrls.map(url => ({ url }));
            }

            await updateDoc(productDocRef, updateData);

            setIsSuccess(true);
            onUpdateSuccess();
        } catch (err) {
            console.error("Error while updating product: ", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center">Update product</h2>

                {/* Messages de feedback */}
                {isLoading && (
                    <div className="fixed inset-0 flex items-center justify-center z-[90]">
                        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm"></div>
                        <p className="text-center text-blue-500 mb-4 z-[100]">Update in process..</p>
                        <span className='loading loading-infinity loading-xl z-[100]'></span>
                    </div>
                )}
                {isSuccess && <p className="text-center text-green-500 mb-4">The updating was successful !</p>}
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
                            className="input w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                        <label className="label mt-4">Prix</label>
                        <input
                            id="price"
                            type="number"
                            name="price"
                            value={productFormData.price}
                            onChange={handleOnChange}
                            className="input w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                        <label className="label mt-4">Images actuelles</label>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {productFormData.images.length > 0 ? (
                                productFormData.images.map((image, index) => (
                                    <img key={index} src={image.url} alt={`Produit ${index + 1}`} className="w-24 h-24 object-cover rounded-md border" />
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">Aucune image existante.</p>
                            )}
                        </div>
                        <label className="label mt-4">Nouvelles images (remplaceront les précédentes)</label>
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
                                ${isLoading
                                    ? 'bg-indigo-300 cursor-not-allowed'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                }`}
                        >
                            {isLoading ? 'Update in procss...' : 'Update product'}
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
