import React, { useEffect, useState } from 'react';
import OrderCard from './OrderCard';

const ClientOrdersView = ({
    clientId,
    error,
    setError,
    isLoading,
    setIsLoading

}) => {
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
            console.log(params.toString());
            const res = await fetch(`/orders?${params.toString()}`,
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



    const deleteOrderHandler = async (orderId) => {

        const previousOrders = orders;

        setOrders(prev => prev.filter(o => o.id !== orderId));


        try {
            const response = await fetch(`/orders/${orderId}`,
                {
                    method: 'DELETE'
                }
            )


            if (!response.ok) {
                const errorData = await response.json();

                throw new Error(errorData.message || "Error occured.");
            }


            alert("Order successfully deleted.");

        }
        catch (error) {
            setOrders(previousOrders);
            setError(`Error: ${error.message}`)

        }

    }


    useEffect(() => {
        if (needRefresh) {
            fetchClientOrders(clientId);
            setNeedRefresh(false);
        }
    }, [needRefresh, clientId])


    return (
        <div className="w-full">
            <h2 className="text-3xl font-bold mb-6 text-center">Orders managing</h2>

            {orders.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {orders.map(order => (
                        <OrderCard
                            key={order.id}
                            clientId={clientId}
                            orderId={order.id}
                            deliveringDate={order.deliveringDate}
                            status={order.status}
                            paidAt={order.paidAt}
                            onDelete={deleteOrderHandler}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-600">This client has no order yet.</p>
            )}
        </div>
    );
}

export default ClientOrdersView;