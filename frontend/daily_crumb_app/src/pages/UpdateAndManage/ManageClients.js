import NavBar from '../../components/navigation/NavBar';
import { useState } from 'react';
import CardList from "../../components/clients/CardList";
const ManageClients = () => {
    const [isOpen, setIsOpen] = useState(false);// fornavBar

    return (
        <div className="flex h-screen bg-gray-50">

            <NavBar isOpen={isOpen} setIsOpen={setIsOpen} />

            <div
                className={`flex-1 p-8 overflow-y-auto transition-all duration-300 ${isOpen ? "ml-64" : "ml-16"
                    }`}
            >
                <div className="flex flex-col items-center space-y-8">
                    <CardList />
                </div>
            </div>
        </div>
    )
}

export default ManageClients;