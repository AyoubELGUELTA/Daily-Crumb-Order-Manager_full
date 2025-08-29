import React from 'react';
import AddClientForm from '../../components/clients/AddClientForm';
import { useState } from 'react';
import NavBar from '../../components/navigation/NavBar';


const AddProducts = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <NavBar isOpen={isOpen} setIsOpen={setIsOpen} />

            <AddClientForm />
        </div>
    );
};

export default AddProducts;