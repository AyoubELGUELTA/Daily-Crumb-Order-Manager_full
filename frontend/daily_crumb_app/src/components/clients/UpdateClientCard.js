import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import ClientOrdersView from '../orders/ClientOrdersView';

const UpdateClientCard = ({
    clientId,
    clientName,
    clientEmail,
    clientCreatedDate,
    onDelete,
    error,
    setError,
    isLoading,
    setIsLoading
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isBeingHovered, setIsBeingHovered] = useState(false);
    const [isOrderview, setIsOrderView] = useState(false);

    const toggleIsEditing = () => setIsEditing(prev => !prev);

    const deleteClientHandler = (e) => {
        e.stopPropagation();
        onDelete(clientId);
    };

    const defaultClientImage = "https://www.pphfoundation.ca/wp-content/uploads/2018/05/default-avatar.png";

    const handleViewClientOrderClick = (e) => {
        e.stopPropagation();
        setIsOrderView(prev => !prev);
    };

    return (
        <div
            onMouseEnter={() => setIsBeingHovered(true)}
            onMouseLeave={() => {
                setIsBeingHovered(false);
                setIsEditing(false);
            }}
            className={`relative w-[17rem] rounded-lg cursor-pointer transition-all duration-500 
        ${isBeingHovered ? "scale-110 shadow-xl shadow-black/50 -translate-y-1.5" : ""} 
        ${isEditing ? "-translate-y-8 shadow-black/70" : ""}`}
        >
            {/* Carte client */}
            <div
                onClick={toggleIsEditing}
                className={`bg-white rounded-lg shadow-md p-4 flex flex-col h-full w-full transition-all duration-500 
          ${isEditing ? "blur-sm opacity-50" : ""}`}
            >
                <img
                    src={defaultClientImage}
                    alt="defaultProfilePicture"
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

            {/* Boutons d'édition */}
            {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center gap-4">
                    <button
                        onClick={deleteClientHandler}
                        className="p-2 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition"
                    >
                        🗑
                    </button>
                    <button
                        onClick={handleViewClientOrderClick}
                        className="p-2 bg-indigo-500 text-white rounded-full shadow hover:bg-indigo-600 transition"
                    >
                        📦
                    </button>
                </div>
            )}

            {isOrderview && createPortal(
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="relative bg-white p-6 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto w-[80%] md:w-[60%]">
                        <button
                            onClick={handleViewClientOrderClick}
                            className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                            ✕
                        </button>
                        <ClientOrdersView
                            clientId={clientId}
                            error={error}
                            setError={setError}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                        />
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default UpdateClientCard;
