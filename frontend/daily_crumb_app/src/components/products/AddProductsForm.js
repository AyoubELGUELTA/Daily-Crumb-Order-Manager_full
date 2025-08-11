import React from 'react';

const AddProductsForm = (props) => {

    const [enteredFormData, setEnteredFormData] = useState({
        name: "",
        price: ""
    })

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleImageChange = (e) => {
        // e.target.files est une FileList. On la stocke directement
        setProductImages(e.target.files);
    };

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

            // // Ajouter les images si elles existent
            // if (enteredFormData.productImages) {
            //     // On boucle sur tous les fichiers sélectionnés et on les ajoute
            //     for (let i = 0; i < enteredFormData.productImages.length; i++) {
            //         formData.append('images', enteredFormData.productImages[i]);
            //     }
            // }

            // Envoyer la requête au backend
            const response = await fetch('/api/products', { // REPRENDRE A PARTIR DE LA ###############
                //###############################################################################*
                //#########################################################################
                method: 'POST',
                // IMPORTANT : Ne pas définir 'Content-Type' sur 'multipart/form-data' manuellement.
                // Le navigateur le fait pour vous, en incluant la bonne 'boundary'.
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de l\'ajout du produit.');
            }

            // Réinitialiser le formulaire après un succès
            setProductName('');
            setProductPrice('');
            setProductImages(null);
            setIsSuccess(true);
            setIsLoading(false);

        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };


    return (
        <div>

        </div>
    );
};

export default AddProductsForm;