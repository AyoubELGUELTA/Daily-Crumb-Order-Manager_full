import React, { useEffect, useState } from 'react';
import ClientOrdersView from '../orders/ClientOrdersView';

const UpdateClientCard = ({
    clientId,
    clientName,
    clientEmail,
    clientCreatedDate,
    onDelete,

}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isBeingHovered, setIsBeingHovered] = useState(false);
    const [isOrderview, setIsOrderView] = useState(false);


    const toggleIsEditing = () => {
        setIsEditing(lastValue => !lastValue);
    };

    const deleteClientHandler = (e) => {
        e.stopPropagation();
        onDelete(clientId);

    };

    const openClientOrdersList = () => {
        openClientOrdersList(clientId);
    }

    const defaultClientImage = "https://www.pphfoundation.ca/wp-content/uploads/2018/05/default-avatar.png"
    const defaultAltText = "defaultProfilePicture"
    return (
        <div
            onMouseEnter={() => setIsBeingHovered(true)}
            onMouseLeave={() => {
                setIsBeingHovered(false);
                setIsEditing(false);
            }}
            className={`relative w-[17rem] rounded-lg cursor-pointer transition-all duration-500 
    ${isBeingHovered ? "scale-110 shadow-xl shadow-black/50 -translate-y-1.5" : ""} 
    ${isEditing ? "-translate-y-8 shadow-black/70" : ""}
  `}
        >
            {/* Carte client */}
            <div
                onClick={toggleIsEditing}
                className={`bg-white rounded-lg shadow-md p-4 flex flex-col h-full w-full transition-all duration-500 ${isEditing ? "blur-sm opacity-50" : ""
                    }`}
            >
                <img
                    src={defaultClientImage}
                    alt={defaultAltText}
                    className="w-full h-32 object-cover rounded-md mb-4"
                />

                <div className="flex flex-col flex-grow text-center">
                    <h3 className="text-xl font-bold break-words">{clientName}</h3>
                    <h4 className="text-lg font-extrabold break-words">{clientEmail}</h4>
                </div>

                <div className="mt-4 flex justify-center">
                    <span className="text-sm font-medium text-gray-600">
                        {new Date(clientCreatedDate).toLocaleDateString("fr-FR")}
                    </span>
                </div>
            </div>

            {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center gap-4">
                    <button
                        onClick={deleteClientHandler}
                        className="p-2 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            fill="currentColor"
                            className="bi bi-trash"
                            viewBox="0 0 16 16"
                        >
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1z" />
                        </svg>
                    </button>

                    <button
                        onClick={setIsOrderView(true)}
                        className="p-2 bg-indigo-500 text-white rounded-full shadow hover:bg-indigo-600 transition">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 2.25h1.5l1.5 9h13.5l1.5-6H6.75m0 0L5.25 2.25M6.75 11.25h12.75m-12.75 0l1.5 9h9l1.5-9"
                            />
                        </svg>
                    </button>
                </div>
            )}
            {isOrderview ? <div> <ClientOrdersView clientId={clientId} /> </div> :
                null
            }
        </div>



    );
};

export default UpdateClientCard;