import React, { use, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UpdateCard = (props) => {
    // props to give to this component: -name, -price, -inStock, -image, -altText, -
    const [isEditing, setIsEditing] = useState(false);
    const [isBeingHovered, setIsBeingHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate();
    const toggleIsEditing = () => {
        setIsEditing(lastValue => !lastValue);
    };

    const deleteProductHandler = (productId) => {
        setIsLoading(true);
        fetch(`/products/${productId}`,
            {
                method: 'DELETE'
            }
        )
            .then(async response => {
                // Le corps de la réponse doit être lu, peu importe le statut.
                // On utilise "async/await" à l'intérieur du "then" pour plus de clarté.
                const data = await response.json();

                if (!response.ok) {
                    // Si la réponse n'est pas OK, on lance une erreur
                    // en incluant le message du backend
                    console.log(data, response);
                    setIsLoading(false);
                    throw new Error(data.message || "Une erreur est survenue.");
                }

                // Si tout est OK, on retourne les données pour le prochain "then"
                return data;
            })
            .then(data => {
                // Handle successful login data, e.g., store the auth token
                console.log('Login successful:', data);
                setLoadingAttemptMessage(data.message);
                setIsLoading(false);
                navigate('/homeCooking');


            })
            .catch(error => {
                // Handle network errors or errors from the server
                console.error('Error during login:', error);
                setLoadingAttemptMessage(error.message)
                setIsLoading(false);

            })

    };


    const defaultImage = "https://image.pngaaa.com/700/5273700-middle.png"

    return (
        <div onMouseEnter={() => setIsBeingHovered(true)}
            onMouseLeave={() => {
                setIsBeingHovered(false);
                setIsEditing(false);
            }
            }
            onClick={toggleIsEditing}

            className={`max-w-[15rem] flex rounded-lg p-4 cursor-pointer hover:bg-indigo-500 hover:text-indigo-500 
        hover:bg-opacity-80 hover:shadow-xl hover:shadow-black/50 hover:translate-y-[-6px] transition-all duration-500
        ${isBeingHovered ? "scale-110 " : ""}
        ${isEditing ? "translate-y-[-30px] shadow-black/70" : ""}`}>
            < div className="bg-white rounded-lg shadow-md p-4" >
                <img
                    src={props.image ? props.image : defaultImage}
                    alt={props.altText}
                    className={`w-full h-32 object-cover rounded-md mb-4 transition-all duration-500 
                                ${isBeingHovered ? 'border-0 scale-125' : 'border-4 border-indigo-500'}`} />


                <div className='flex flex-col'>
                    <div>
                        <h3 className="text-xl text-center font-extrabold font-sans">
                            {props.name} Fateau a la framboiseeeee
                        </h3>
                    </div>
                    <div className='mt-4 flex justify-between'>
                        <div className="badge badge-soft badge-primary">
                            Price </div>

                        {props.inStock ?
                            <div className="badge badge-success">
                                <svg className="size-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="currentColor" strokeLinejoin="miter" strokeLinecap="butt"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeLinecap="square" stroke-miterlimit="10" strokeWidth="2"></circle><polyline points="7 13 10 16 17 8" fill="none" stroke="currentColor" strokeLinecap="square" stroke-miterlimit="10" strokeWidth="2"></polyline></g></svg>
                                In Stock
                            </div>
                            :

                            <div className="badge badge-error">
                                <svg className="size-[1em] mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="currentColor"><rect x="1.972" y="11" width="20.056" height="2" transform="translate(-4.971 12) rotate(-45)" fill="currentColor" strokeWidth={0}></rect><path d="m12,23c-6.065,0-11-4.935-11-11S5.935,1,12,1s11,4.935,11,11-4.935,11-11,11Zm0-20C7.038,3,3,7.037,3,12s4.038,9,9,9,9-4.037,9-9S16.962,3,12,3Z" strokeWidth={0} fill="currentColor"></path></g></svg>
                                In Stock
                            </div>

                        }
                    </div>


                    {/* <div className="mt-2 hidden sm:block">
                    <p className="text-gray-600 mt-2 hidden sm:block" >{props.description ? props.description : "Description is getting cooked soon..."}</p>
                </div>   CA SERA A AJOUTER A LA CARD OURPRODUCTS, VISIBLE PAR TOUS NOS CLIENTS. */ }
                </div>
            </div >
            {isEditing && (
                <div className="absolute top-1/2 right-0 transform translate-x-[6px]  flex flex-col gap-2 p-2 bg-white rounded-lg shadow-xl">
                    <button onClick={(e) => {
                        e.stopPropagation();
                        navigate('/update/products/product');
                    }}
                        className="btn btn-square">
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5l-4-4 1.41-1.41L11 14.67l7.59-7.59L20 8.5l-9 9z" />
                        </svg>
                    </button>
                    <button className="btn btn-square">
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16 9v-2h-3v-2h-2v2H8v2h-3v-2H2v2H0v2h2v-2h3v-2h2v2h2v-2h3v2h3v-2zm-6-2v-2h-2v2H10zM5 14h14v2H5v-2z" />
                        </svg>
                    </button>
                    <button className="btn btn-square">
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                        </svg>
                    </button>
                </div>
            )}
        </div >
    );
};

export default UpdateCard;