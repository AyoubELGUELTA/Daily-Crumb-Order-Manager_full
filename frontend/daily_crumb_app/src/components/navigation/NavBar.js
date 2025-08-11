import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// Importer les icônes nécessaires
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import {
    HomeIcon,
    ShoppingBagIcon,
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    ChartPieIcon,
} from "@heroicons/react/24/outline";

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    // Nouveaux états pour chaque menu déroulant
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
    const [isUpdateMenuOpen, setIsUpdateMenuOpen] = useState(false);
    const [isDeleteMenuOpen, setIsDeleteMenuOpen] = useState(false);


    useEffect(() => {
        if (!isOpen) {
            setIsAddMenuOpen(isOpen);
            setIsDeleteMenuOpen(isOpen);
            setIsUpdateMenuOpen(isOpen);
        }
    }, [isOpen]);

    return (

        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div
                className={`bg-gray-800 text-white flex flex-col transition-all duration-300 ${isOpen ? "w-64" : "w-16"
                    }`}
            >
                {/* Bouton flèche pour la bascule de la barre latérale */}
                <button
                    className="p-2 self-end m-2 rounded hover:bg-gray-700 focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? "Fermer la barre latérale" : "Ouvrir la barre latérale"}
                >
                    {isOpen ? (
                        <ChevronLeftIcon className="h-6 w-6" />
                    ) : (
                        <ChevronRightIcon className="h-6 w-6" />
                    )}
                </button>

                {/* Conteneur principal du menu de navigation */}
                <nav className="flex flex-col flex-1 gap-2 p-2">
                    {/* Onglet "HomeCooking" */}
                    <Link
                        to="/homeCooking"
                        className="flex items-center gap-2 py-3 px-4 hover:bg-gray-700 rounded-lg text-lg"
                    >
                        <HomeIcon className="h-6 w-6" />
                        {isOpen && <span>HomeCooking</span>}
                    </Link>

                    {/* Onglet "Our Products" - accessible au public */}
                    <Link
                        to="/products"
                        className="flex items-center gap-2 py-3 px-4 hover:bg-gray-700 rounded-lg text-lg"
                    >
                        <ShoppingBagIcon className="h-6 w-6" />
                        {isOpen && <span>Our Products</span>}
                    </Link>

                    {/* Menu déroulant "Add and Create" */}
                    <div className="bg-gray-700 rounded-lg">
                        <button
                            className="w-full text-left py-3 px-4 flex items-center justify-between focus:outline-none"
                            onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                            aria-expanded={isAddMenuOpen}
                        >
                            <div className="flex items-center gap-2">
                                <PlusIcon className="h-6 w-6" />
                                {isOpen && <span>Add and Create</span>}
                            </div>
                            {isOpen && (
                                <ChevronRightIcon
                                    className={`h-5 w-5 transform transition-transform ${isAddMenuOpen ? "rotate-90" : "rotate-0"
                                        }`}
                                />
                            )}
                        </button>
                        {isAddMenuOpen && (
                            <ul className="menu p-0">
                                <li>
                                    <Link to="/add/products" className="py-2 px-4 hover:bg-gray-600 rounded-lg">Products</Link>
                                </li>
                                <li>
                                    <Link to="/add/clients" className="py-2 px-4 hover:bg-gray-600 rounded-lg">Clients</Link>
                                </li>
                                <li>
                                    <Link to="/add/orders" className="py-2 px-4 hover:bg-gray-600 rounded-lg">Orders</Link>
                                </li>
                            </ul>
                        )}
                    </div>

                    {/* Menu déroulant "Update and Manage" */}
                    <div className="bg-gray-700 rounded-lg">
                        <button
                            className="w-full text-left py-3 px-4 flex items-center justify-between focus:outline-none"
                            onClick={() => setIsUpdateMenuOpen(!isUpdateMenuOpen)}
                            aria-expanded={isUpdateMenuOpen}
                        >
                            <div className="flex items-center gap-2">
                                <PencilSquareIcon className="h-6 w-6" />
                                {isOpen && <span>Update and Manage</span>}
                            </div>
                            {isOpen && (
                                <ChevronRightIcon
                                    className={`h-5 w-5 transform transition-transform ${isUpdateMenuOpen ? "rotate-90" : "rotate-0"
                                        }`}
                                />
                            )}
                        </button>
                        {isUpdateMenuOpen && (
                            <ul className="menu p-0">
                                <li>
                                    <Link to="/update/products" className="py-2 px-4 hover:bg-gray-600 rounded-lg">Products</Link>
                                </li>
                                <li>
                                    <Link to="/update/orders" className="py-2 px-4 hover:bg-gray-600 rounded-lg">Orders</Link>
                                </li>
                            </ul>
                        )}
                    </div>

                    {/* Menu déroulant "Delete or Fire" */}
                    <div className="bg-gray-700 rounded-lg">
                        <button
                            className="w-full text-left py-3 px-4 flex items-center justify-between focus:outline-none"
                            onClick={() => setIsDeleteMenuOpen(!isDeleteMenuOpen)}
                            aria-expanded={isDeleteMenuOpen}
                        >
                            <div className="flex items-center gap-2">
                                <TrashIcon className="h-6 w-6" />
                                {isOpen && <span>Delete or Fire</span>}
                            </div>
                            {isOpen && (
                                <ChevronRightIcon
                                    className={`h-5 w-5 transform transition-transform ${isDeleteMenuOpen ? "rotate-90" : "rotate-0"
                                        }`}
                                />
                            )}
                        </button>
                        {isDeleteMenuOpen && (
                            <ul className="menu p-0">
                                <li>
                                    <Link to="/delete/products" className="py-2 px-4 hover:bg-gray-600 rounded-lg">Products</Link>
                                </li>
                                <li>
                                    <Link to="/delete/employees" className="py-2 px-4 hover:bg-gray-600 rounded-lg">Employees</Link>
                                </li>
                                <li>
                                    <Link to="/delete/clients" className="py-2 px-4 hover:bg-gray-600 rounded-lg">Clients</Link>
                                </li>
                            </ul>
                        )}
                    </div>

                    {/* Onglet "Stats and overview" */}
                    <Link
                        to="/stats"
                        className="flex items-center gap-2 py-3 px-4 hover:bg-gray-700 rounded-lg text-lg"
                    >
                        <ChartPieIcon className="h-6 w-6" />
                        {isOpen && <span>Stats and overview</span>}
                    </Link>
                </nav>
            </div>
        </div>
    )
};



export default NavBar;