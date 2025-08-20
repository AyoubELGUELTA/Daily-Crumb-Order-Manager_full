import React from 'react';
import CardList from '../../components/products/CardList';
import NavBar from '../../components/navigation/NavBar';
import FirebaseProvider from '../../contexts/FirebaseProvider';
const UpdateProducts = () => {



    return (
        <FirebaseProvider>
            <div className='flex'>
                <NavBar />
                <div>
                    <CardList />
                </div>
            </div>
        </FirebaseProvider>
    );
};

export default UpdateProducts;