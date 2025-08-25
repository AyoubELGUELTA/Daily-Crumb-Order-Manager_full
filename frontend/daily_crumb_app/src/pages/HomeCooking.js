import { useState } from 'react';
import NavBar from '../components/navigation/NavBar';
const HomeCooking = () => {

    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>
            <NavBar isOpen={isOpen} setIsOpen={setIsOpen} />


        </div>

    );
};

export default HomeCooking;