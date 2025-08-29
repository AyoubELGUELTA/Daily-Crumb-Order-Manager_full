import React from 'react';
import AddProductsForm from '../../components/products/AddProductsForm';
import { useState } from 'react';
import NavBar from '../../components/navigation/NavBar';


const AddProducts = () => {
    const [isOpen, setIsOpen] = useState(false);//for navBar

    return (
        <div>
            <NavBar isOpen={isOpen} setIsOpen={setIsOpen} />

            <AddProductsForm />
        </div>
    );
};

export default AddProducts;