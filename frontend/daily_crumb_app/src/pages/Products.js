import React from 'react';

const Products = () => {
    return (
        <section>
            <h1>
                All products
            </h1>

            <div className="fixed inset-0 flex items-center justify-center z-[90]">

                {/* La superposition (fond flou et blanc) */}
                <div className="fixed inset-0 bg-white/50 backdrop-blur-sm"></div>

                {/* Le spinner (qui est au-dessus de la superposition) */}
                <span className='loading loading-infinity loading-lg z-[100]'></span>

            </div>


            {/* <Products meetups={loadedMeetups} />  */}

        </section >
    );
};


export default Products;