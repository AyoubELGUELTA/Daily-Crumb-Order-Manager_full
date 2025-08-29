import React, { useState } from "react";
import CardList from "../../components/products/CardList";
import NavBar from '../../components/navigation/NavBar';

const UpdateProducts = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Navbar */}
            <NavBar isOpen={isNavOpen} setIsOpen={setIsNavOpen} />

            {/* Principal contenu */}
            <div
                className={`flex-1 p-8 overflow-y-auto transition-all duration-300 ${isNavOpen ? "ml-64" : "ml-16"
                    }`}
            >
                <div className="flex flex-col items-center space-y-8">
                    <CardList />
                </div>
            </div>
        </div>
    );
};

export default UpdateProducts;
