import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    HomeIcon,
    ShoppingBagIcon,
    ChartPieIcon,
    ArrowLeftOnRectangleIcon,
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";

const NavBar = ({ isOpen, setIsOpen }) => {
    // État des menus déroulants
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
    const [isUpdateMenuOpen, setIsUpdateMenuOpen] = useState(false);
    const [isDeleteMenuOpen, setIsDeleteMenuOpen] = useState(false);

    // Fermer les sous-menus si la nav est refermée
    useEffect(() => {
        if (!isOpen) {
            setIsAddMenuOpen(false);
            setIsUpdateMenuOpen(false);
            setIsDeleteMenuOpen(false);
        }
    }, [isOpen]);


    useEffect(() => {
        if (isAddMenuOpen || isDeleteMenuOpen || isUpdateMenuOpen) {
            setIsOpen(true);

        }
    }, [isAddMenuOpen, isDeleteMenuOpen, isUpdateMenuOpen, setIsOpen])
    return (
        <div
            className={`bg-gray-800 text-white flex flex-col transition-all duration-300 ${isOpen ? "w-64" : "w-16"
                } h-screen fixed top-0 left-0`}
        >
            {/* Bouton Toggle */}
            <button
                className="p-2 self-end m-2 rounded hover:bg-gray-700 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? (
                    <ChevronLeftIcon className="h-6 w-6" />
                ) : (
                    <ChevronRightIcon className="h-6 w-6" />
                )}
            </button>

            {/* NAVIGATION */}
            <nav className="flex flex-col flex-1 gap-2 p-2">
                {/* HOME */}
                <Link
                    to="/homeCooking"
                    className="flex items-center gap-2 py-3 px-4 hover:bg-gray-700 rounded-lg text-lg"
                >
                    <HomeIcon className="h-6 w-6" />
                    {isOpen && <span>HomeCooking</span>}
                </Link>

                {/* PRODUCTS */}
                <Link
                    to="/products"
                    className="flex items-center gap-2 py-3 px-4 hover:bg-gray-700 rounded-lg text-lg"
                >
                    <ShoppingBagIcon className="h-6 w-6" />
                    {isOpen && <span>Our Products</span>}
                </Link>

                {/* ADD */}
                <div>
                    <button
                        onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                        className="flex items-center gap-2 w-full py-3 px-4 hover:bg-gray-700 rounded-lg text-lg"
                    >
                        <PlusIcon className="h-6 w-6" />
                        {isOpen && <span>Add</span>}
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ${isAddMenuOpen ? "max-h-40" : "max-h-0"
                            }`}
                    >
                        <Link
                            to="/add/products"
                            className="block py-2 pl-12 pr-4 hover:bg-gray-700 rounded-lg"
                        >
                            Product
                        </Link>
                        <Link
                            to="/add/orders"
                            className="block py-2 pl-12 pr-4 hover:bg-gray-700 rounded-lg"
                        >
                            Order
                        </Link>
                    </div>
                </div>

                {/* UPDATE */}
                <div>
                    <button
                        onClick={() => setIsUpdateMenuOpen(!isUpdateMenuOpen)}
                        className="flex items-center gap-2 w-full py-3 px-4 hover:bg-gray-700 rounded-lg text-lg"
                    >
                        <PencilSquareIcon className="h-6 w-6" />
                        {isOpen && <span>Update</span>}
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ${isUpdateMenuOpen ? "max-h-40" : "max-h-0"
                            }`}
                    >
                        <Link
                            to="/update/products"
                            className="block py-2 pl-12 pr-4 hover:bg-gray-700 rounded-lg"
                        >
                            Products
                        </Link>
                        <Link
                            to="/update/category"
                            className="block py-2 pl-12 pr-4 hover:bg-gray-700 rounded-lg"
                        >
                            Category
                        </Link>
                    </div>
                </div>

                {/* DELETE */}
                <div>
                    <button
                        onClick={() => setIsDeleteMenuOpen(!isDeleteMenuOpen)}
                        className="flex items-center gap-2 w-full py-3 px-4 hover:bg-gray-700 rounded-lg text-lg"
                    >
                        <TrashIcon className="h-6 w-6" />
                        {isOpen && <span>Delete</span>}
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ${isDeleteMenuOpen ? "max-h-40" : "max-h-0"
                            }`}
                    >
                        <Link
                            to="/delete/product"
                            className="block py-2 pl-12 pr-4 hover:bg-gray-700 rounded-lg"
                        >
                            Product
                        </Link>
                        <Link
                            to="/delete/category"
                            className="block py-2 pl-12 pr-4 hover:bg-gray-700 rounded-lg"
                        >
                            Category
                        </Link>
                    </div>
                </div>

                {/* STATS */}
                <Link
                    to="/stats"
                    className="flex items-center gap-2 py-3 px-4 hover:bg-gray-700 rounded-lg text-lg"
                >
                    <ChartPieIcon className="h-6 w-6" />
                    {isOpen && <span>Stats and overview</span>}
                </Link>

                {/* LOGIN */}
                <Link
                    to="/authentification"
                    className="mt-auto flex items-center gap-2 py-3 px-4 hover:bg-gray-700 rounded-lg text-lg"
                >
                    <ArrowLeftOnRectangleIcon className="h-6 w-6" />
                    {isOpen && <span>Login/Sign Up</span>}
                </Link>
            </nav>
        </div>
    );
};

export default NavBar;
