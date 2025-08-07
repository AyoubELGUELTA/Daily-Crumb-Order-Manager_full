
const ProductItem = (props) => {
    return (
        <li >

            <div >
                <img src={props.image} alt={props.title} />
            </div>
            <div>
                <h3>{props.name}</h3>
                <p>{props.price}</p>
                <p>{props.inStock}</p>
            </div>
        </li>
    );
};

export default ProductItem;