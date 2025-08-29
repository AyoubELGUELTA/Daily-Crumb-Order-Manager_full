import NavBar from '../../components/navigation/NavBar';
import { useState } from 'react';
const ManageClients = () => {
    const [isOpen, setIsOpen] = useState(false);// fornavBar

    return (
        <div>
            <NavBar isOpen={isOpen} setIsOpen={setIsOpen} />

        </div>
    )
}

export default ManageClients;