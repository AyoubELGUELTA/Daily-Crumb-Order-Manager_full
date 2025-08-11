import { Spinner } from 'flowbite-react';

const OurProducts = () => {
    return (
        <section>
            <h1 className='text-center text-4xl'>
                All products
            </h1>

            {/* <div className="fixed inset-0 flex items-center justify-center z-[90]">

                {/* La superposition (fond flou et blanc) */}
            {/* <div className="fixed inset-0 bg-white/50 backdrop-blur-sm"></div> */}

            {/* Le spinner (qui est au-dessus de la superposition) */}
            <div className="flex justify-center items-center h-screen">
                <Spinner size="lg" color="info" />            </div>
            {/* </div> */}
            {/* */}

            {/* <Products meetups={loadedMeetups} />  */}

        </section >
    );
};


export default OurProducts;