import React from 'react';

import { useState } from 'react';

const DeleteCase = (props) => {

    const [isDeleting, setIsDeleting] = useState(false);

    const [error, setError] = useState(null);



    const toggleDeleteProduct = async () => {

        setIsDeleting(true);
        setError(null);

        try {
            const response = await fetch(`/products/${props.productId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Error during suppression.');
            }

            if (props.onDeleteSuccess) {
                props.onDeleteSuccess(props.productId);
            }


        }

        catch (err) {
            setError(err.message);
        }
        finally {
            setIsDeleting(false);
        }





    }


    return (


        <div>
            {isDeleting && 'Deletion in progress...'}
            {!isDeleting && (
                <button onClick={toggleDeleteProduct} disabled={isDeleting}>
                    Delete
                </button>
            )}
        </div>
    );
};

export default DeleteCase;