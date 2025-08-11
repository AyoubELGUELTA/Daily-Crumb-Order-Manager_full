import React from 'react';

const ProductCard = (props) => {
    if (props.image === "") {
        const defaultImage = "https://image.pngaaa.com/700/5273700-middle.png"
    }
    return (
        <div className="card bg-base-100 w-96 shadow-sm">
            <figure>
                <img
                    src={props.image ? props.image : defaultImage}
                    alt={props.altText} />
            </figure>
            <div className="card-body">
                <h2 className="card-title">
                    {props.name}
                </h2>
                <p>{props.description}</p>
            </div>
        </div>
    );
};

export default ProductCard;