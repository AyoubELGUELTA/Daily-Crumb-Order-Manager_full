import React, { useEffect, useState } from 'react';

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



    const handleToggleStock = (e) => {
        e.stopPropagation();
        onInStockChange(productId, !productInStock);
    };


    const toggleIsEditing = () => {
        setIsEditing(lastValue => !lastValue);
    };

    const deleteProductHandler = (e) => {
        e.stopPropagation();
        onDelete(productId);

    };

    const openEditFormHandler = () => {
        onGeneralChange(productId);
    }



    const defaultImage = "https://image.pngaaa.com/700/5273700-middle.png"

    const [currentImage, setCurrentImage] = useState({
        url: "",
        altText: "",

    });


    useEffect(() => {
        // Set an initial image on mount
        if (productImages && productImages.length > 0) {
            setCurrentImage(productImages[0]);
        } else {
            setCurrentImage({ url: defaultImage, altText: "No_Image_Available" });
        }

        if (productImages && productImages.length > 1) {
            const min = 5000;
            const max = 7000;
            const randomInterval = Math.floor(Math.random() * (max - min + 1000)) + min;
            const interval = setInterval(() => {
                setCurrentImage(prevImage => {
                    const currentIndex = productImages.findIndex(img => img.url === prevImage.url);
                    const nextIndex = (currentIndex + 1) % productImages.length;
                    return productImages[nextIndex];
                });
            }, randomInterval);

            // Cleanup function to clear the interval
            return () => clearInterval(interval);
        }
    }, [productImages, defaultImage]);

    // ... (Your existing component code)

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
                    src={currentImage.url}
                    alt={currentImage.altText || `${productName}/${productId}`}
                    className="w-full h-32 object-cover rounded-md mb-4 transition-all duration-500"
                />

                <div className='flex flex-col flex-grow'>
                    <h3 className="text-xl text-center font-extrabold font-sans">
                        {productName}
                    </h3>
                </div>

                <div className='mt-4 flex justify-between self-end w-full'>
                    <div className="badge badge-soft badge-primary">
                        {productPrice}
                    </div>

                    {productInStock ?
                        <div className="badge badge-success">
                            In Stock
                        </div>
                        :
                        <div className="badge badge-error">
                            Out of Stock
                        </div>
                    }
                </div>
            </div>

            {isEditing && (
                <div className="absolute top-1/2 right-0 transform translate-x-[6px] flex flex-col gap-2 p-2 bg-white rounded-lg shadow-xl">
                    <button onClick={(e) => {
                        e.stopPropagation()
                        openEditFormHandler()
                    }} className="btn btn-square">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                        </svg>
                    </button>
                    <button onClick={handleToggleStock} className="btn btn-square">
                        {productInStock ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-toggle-on" viewBox="0 0 16 16">
                            <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8" />
                        </svg> :
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-toggle-off" viewBox="0 0 16 16">
                                <path d="M11 4a4 4 0 0 1 0 8H8a5 5 0 0 0 2-4 5 5 0 0 0-2-4zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8M0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5" />
                            </svg>
                        }
                    </button>
                    <button onClick={deleteProductHandler} className="btn btn-square">
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

export default UpdateCard;