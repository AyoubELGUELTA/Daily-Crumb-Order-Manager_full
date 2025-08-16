import React, { use, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UpdateCard = ({
    productId,
    productName,
    productPrice,
    productInStock,
    productImages,
    onDelete,
    onInStockChange,
    onGeneralChange
}) => {
    // props to give to this component: -name, -price, -inStock, -image, -altText, -
    const [isEditing, setIsEditing] = useState(false);
    const [isBeingHovered, setIsBeingHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [isInStock, setIsInStock] = useState(productInStock);

    const mainImage = productImages.find(img => img.isMain);


    const handleToggleStock = (e) => {
        e.stopPropagation();
        const newStock = !isInStock;
        setIsInStock(newStock);
        onInStockChange(productId, newStock);
    };


    const navigate = useNavigate();
    const toggleIsEditing = () => {
        setIsEditing(lastValue => !lastValue);
    };

    const deleteProductHandler = (e) => {
        e.stopPropagation();
        onDelete(productId);

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
                    src={mainImage.url ? mainImage.url : defaultImage}
                    alt={mainImage.altText ? mainImage.altText : { productName } + "/" + { productId }}
                    className={`w-full h-32 object-cover rounded-md mb-4 transition-all duration-500 
                                ${isBeingHovered ? 'border-0 scale-125' : 'border-4 border-indigo-500'}`} />


                <div className='flex flex-col'>
                    <div>
                        <h3 className="text-xl text-center font-extrabold font-sans">
                            {productName}
                        </h3>
                    </div>
                    <div className='mt-4 flex justify-between'>
                        <div className="badge badge-soft badge-primary">
                            {productPrice} </div>

                        {productInStock ?
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
                        navigate('/update/products/product'); // NO I HAVE TO OPEN A NEW COMPONENT FORM TO UPDATE NAME, PRICE AND MANAGE IMAGES OF THE PRODUCT
                    }}
                        className="btn btn-square">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                        </svg>
                    </button>
                    <button onClick={handleToggleStock} className="btn btn-square">
                        {isInStock ? <svg xmlns="http://www.w3.org/2000/svg" className="size-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16 9v-2h-3v-2h-2v2H8v2h-3v-2H2v2H0v2h2v-2h3v-2h2v2h2v-2h3v2h3v-2zm-6-2v-2h-2v2H10zM5 14h14v2H5v-2z" />
                        </svg> :
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-toggle-off" viewBox="0 0 16 16">
                                <path d="M11 4a4 4 0 0 1 0 8H8a5 5 0 0 0 2-4 5 5 0 0 0-2-4zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8M0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5" />
                            </svg>
                        }
                    </button>
                    <button onClick={deleteProductHandler} className="btn btn-square">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                        </svg>
                    </button>
                </div>
            )}
        </div >
    );
};

export default UpdateCard;