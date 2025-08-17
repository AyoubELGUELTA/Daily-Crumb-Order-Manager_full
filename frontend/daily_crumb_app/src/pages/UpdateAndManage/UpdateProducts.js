import React from 'react';
import UpdateCard from '../../components/products/UpdateCard';
import CardList from '../../components/products/CardList';
import NavBar from '../../components/navigation/NavBar';
const UpdateProducts = () => {



    return (
        <div className='flex'>
            <NavBar />
            <div>
                <CardList />
            </div>
        </div>
    );
};

export default UpdateProducts;