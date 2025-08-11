
import { useState } from 'react';
const AddProductsForm = (props) => {

    const [enteredFormData, setEnteredFormData] = useState({
        name: "",
        price: "",
        inStock: false
    })

    const handleOnChange = (e) => {

        const { name, value } = e.target;

        setEnteredFormData(prevState => {
            return {
                ...prevState,
                [name]: value
            };
        });
    };

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');



    const handleSubmit = async (e) => {
        e.preventDefault(); // Empêche le rechargement de la page

        setIsLoading(true);
        setError('');
        setIsSuccess(false);

        try {
            // Créer un objet FormData, pratique et utile si on veut upload des fichiers/images (doc non binaires)
            const formData = new FormData();

            // Ajouter les champs de texte à l'objet FormData
            formData.append('name', enteredFormData.name);
            formData.append('price', enteredFormData.price);
            formData.append('inStock', enteredFormData.inStock);

            // // Ajouter les images si elles existent
            // if (enteredFormData.productImages) {
            //     // On boucle sur tous les fichiers sélectionnés et on les ajoute
            //     for (let i = 0; i < enteredFormData.productImages.length; i++) {
            //         formData.append('images', enteredFormData.productImages[i]);
            //     }
            // }

            // Envoyer la requête au backend
            const response = await fetch('/products',
                {
                    method: 'POST',
                    // IMPORTANT : Ne pas définir 'Content-Type' sur 'multipart/form-data' manuellement.
                    // Le navigateur le fait pour vous, en incluant la bonne 'boundary'.
                    body: formData,
                });

            if (!response.ok) {
                const errorData = await response.json();
                setIsLoading(false);
                throw new Error(errorData.message || 'Erreur lors de l\'ajout du produit.');
            }

            // Réinitialiser le formulaire après un succès
            setEnteredFormData({
                name: "",
                price: "",
                inStock: false
            })
            setIsSuccess(true);
            setIsLoading(false);

        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center">Add a new product</h2>

                {/* Messages de feedback */}
                {isLoading &&
                    <div className="fixed inset-0 flex items-center justify-center z-[90]">

                        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm"></div>
                        <p className="text-center text-blue-500 mb-4 z-[100]">Addition in process...</p>
                        <span className='loading loading-infinity loading-xl z-[100]'></span>

                    </div>}
                {isSuccess && <p className="text-center text-green-500 mb-4">Product addition was successful !</p>}
                {error && <p className="text-center text-red-500 mb-4">Error : {error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Champ pour le nom du produit */}

                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                        <legend className="fieldset-legend">Product Addition Form</legend>

                        <label className="label">Name</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={enteredFormData.name}
                            onChange={handleOnChange}
                            className="input w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Name (eg. Strawberry cake)"
                            required
                        />


                        <label className="label">Price</label>
                        <input
                            id="price"
                            type="number"
                            name="price"
                            value={enteredFormData.price}
                            onChange={handleOnChange}
                            className="input w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Price (eg. 10.99, 5,..)"
                            required
                        />
                        <div className='mt-5 flex items-center'>
                            <label className="inStock ">In stock</label>
                            <input
                                id="inStock"
                                name="inStock"
                                type="checkbox"
                                value={enteredFormData.inStock}
                                onChange={handleOnChange}
                                className="checkbox checkbox-xl ml-4" />
                        </div>
                    </fieldset>


                    {/* Champ pour l'upload d'images */}
                    {/* <div>
                        <label htmlFor="productImages" className="block text-gray-700 font-medium mb-1">Images du produit</label>
                        <input
                            id="productImages"
                            type="file"
                            multiple // Permet de sélectionner plusieurs fichiers
                            onChange={handleImageChange}
                            className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            accept="image/*" // N'accepte que les fichiers images
                        />
                    </div> */}

                    {/* Bouton de soumission */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 
                            ${isLoading
                                ? 'bg-indigo-300 cursor-not-allowed'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                            }`}
                    >
                        {isLoading ? 'Addition in process..' : 'Add the product'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddProductsForm;