import React, { useEffect } from 'react';
import OrderCard from './OrderCard';

const ClientOrdersView = ({ clientId }) => {
    const [needRefresh, setNeedRefresh] = useState(true);

    const [orders, setOrders] = useState([]);

    const fetchClientOrders = async (clientId) => {
        setIsLoading(true);
        setError('');

        const params = new URLSearchParams();

        if (clientId) {
            params.append("clientId", clientId);
        }
        try {
            const res = await fetch(`/orders${params.toString()}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Error fetching products');
            }
            setOrders(data.orders);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (needRefresh) {
            fetchClientOrders(clientId);
            setNeedRefresh(false);
        }
    }, [needRefresh, setNeedRefresh, clientId])


    return (


        <div className="flex flex-wrap gap-4">
            <h2 className="text-3xl font-bold mb-6 text-center">Orders managing</h2>

            {/* <SearchBar
                    onSearchChange={handleSearchInput}
                    needFilterRefresh={needFilterRefresh}
                    setNeedFilterRefresh={setNeedFilterRefresh}
    
                /> */}

            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center z-[90]">
                    <div className="fixed inset-0 bg-white/50 backdrop-blur-sm"></div>
                    <p className="text-center text-blue-500 mb-4 z-[100]"></p>
                    <span className='loading loading-infinity loading-xl z-[100]'></span>
                </div>
            )}
            {error && (

                <div onClick={handleOverlayClick}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                    <div className="bg-white p-8 rounded-lg shadow-xl text-center">

                        <p className="text-xl font-bold mb-4">{error}</p>
                    </div>

                </div>

            )}


            {orders.length > 0 ? (
                orders.map(order => (
                    <OrderCard
                        orderId={order.id}
                        deliveringDate={order.deliveringDate}
                        status={order.status}
                        paidAt={order.email}

                    />
                ))
            ) : (
                <p>This client has no order yet.</p>
            )}


        </div>

    );
};

export default ClientOrdersView;