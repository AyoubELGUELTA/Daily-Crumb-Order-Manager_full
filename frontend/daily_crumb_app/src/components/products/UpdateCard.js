import React, { useState } from 'react';

const UpdateCard = (props) => {
    // props to give to this component: -name, -price, -inStock, -image, -altText, -
    const [isEditing, setIsEditing] = useState(false);
    const [isBeingHovered, setIsBeingHovered] = useState(false);

    const toggleIsEditing = () => {
        setIsEditing(lastValue => !lastValue);
    };

    const defaultImage = "https://image.pngaaa.com/700/5273700-middle.png"

    return (
        <div onMouseEnter={() => setIsBeingHovered(true)}
            onMouseLeave={() => setIsBeingHovered(false)}

            className={`max-w-xs rounded-lg p-4 cursor-pointer hover:bg-indigo-500 hover:text-indigo-500 
        hover:bg-opacity-80 hover:shadow-xl hover:shadow-black/50 hover:translate-y-[-6px] transition-all duration-500
        ${isBeingHovered ? "scale-110 " : ""}`}>
            < div className="bg-white rounded-lg shadow-md p-4" >
                <img
                    src={props.image ? props.image : defaultImage}
                    alt={props.altText}
                    className={`w-full h-32 object-cover rounded-md mb-4 transition-all duration-500 
                                ${isBeingHovered ? 'border-0 scale-125' : 'border-4 border-indigo-500'}`} />

                <div className="card-body">
                    <div className='flex flex-col mr-5 md:flex-row md:justify-between md:items-center'>
                        <div className="mr-3">
                            <h3 className="text-xl font-extrabold font-sans">
                                {props.name} Fateau a la framboiseeeee
                            </h3>
                        </div>

                        <div className="badge badge-soft badge-primary ml-2 mt-2 md:mt-0">
                            Price </div>

                    </div>

                    {/* <div className="mt-2 hidden sm:block">
                    <p className="text-gray-600 mt-2 hidden sm:block" >{props.description ? props.description : "Description is getting cooked soon..."}</p>
                </div>   CA SERA A AJOUTER A LA CARD OURPRODUCTS, VISIBLE PAR TOUS NOS CLIENTS. */ }
                </div>
            </div >
        </div >
    );
};

export default UpdateCard;