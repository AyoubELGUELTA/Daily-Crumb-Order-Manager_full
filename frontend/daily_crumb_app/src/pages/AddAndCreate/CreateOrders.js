import React from 'react';
import AddOrderForm from '../../components/orders/AddOrderForm';
import { useState } from 'react';
import NavBar from '../../components/navigation/NavBar';


const CreateOrders = () => {
    const [isOpen, setIsOpen] = useState(false);//for navBar

    return (
        <div>
            <NavBar isOpen={isOpen} setIsOpen={setIsOpen} />

            <AddOrderForm />
        </div>
    );
};

export default CreateOrders;