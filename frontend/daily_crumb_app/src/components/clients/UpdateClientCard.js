import React, { useEffect, useState } from 'react';

const UpdateClientCard = ({
    clientId,
    clientName,
    clientEmail,
    clientCreatedDate,
    onDelete,

}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isBeingHovered, setIsBeingHovered] = useState(false);



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
            className={`max-w-[15rem] flex rounded-lg p-4 cursor-pointer hover:bg-indigo-500 hover:text-indigo-500
                hover:bg-opacity-80 hover:shadow-xl hover:shadow-black/50 hover:translate-y-[-6px] transition-all duration-500
                ${isBeingHovered ? "scale-110 " : ""}
                ${isEditing ? "translate-y-[-30px] shadow-black/70" : ""}`}
        >
            <div
                onClick={toggleIsEditing}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col h-full relative">
                <img
                    src={defaultClientImage}
                    alt={defaultAltText}
                    className="w-full h-32 object-cover rounded-md mb-4 transition-all duration-500"
                />

                <div className='flex flex-col flex-grow'>
                    <h3 className="text-xl text-center font-bold font-sans">
                        {clientName}
                    </h3>
                    <h4 className="text-l text-center font-extrabold font-sans">
                        {clientEmail}
                    </h4>
                </div>

                <div className='mt-4 flex justify-between self-end w-full'>
                    <div className="badge badge-soft badge-primary">
                        {clientCreatedDate}
                    </div>


                </div>
            </div>

            {isEditing && (
                <div>
                    <button onClick={deleteClientHandler} className="btn btn-square">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default UpdateClientCard;