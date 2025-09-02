import React, { useEffect, useState } from 'react';

const statusColors = {
    INITIALIZED: "bg-gray-200 text-gray-700",
    PREPARED: "bg-yellow-200 text-yellow-800",
    SHIPPED: "bg-blue-200 text-blue-800",
    DELIVERED: "bg-green-200 text-green-800",
};
const OrderCard = ({ orderId, deliveringDate, status, paidAt }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isBeingHovered, setIsBeingHovered] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [products, setProducts] = useState([]);
    const [needOrderRefresh, setNeedOrdereRefresh] = useState(false);


    useEffect(() => {
        if (needOrderRefresh) {
            getAllOrderDetails();
            setNeedOrdereRefresh(false);
        }
    }, [needOrderRefresh, setNeedOrdereRefresh])

    const toggleIsEditing = () => {
        setIsEditing(lastValue => !lastValue);
    };

    const deleteOrderHandler = (e) => {
        e.stopPropagation();
        onDelete(orderId);

    };

    const openClientOrdersList = () => {
        openClientOrdersList(clientId);
    }

    const getAllOrderDetails = async () => {
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch(`/orders/${orderId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Error fetching order detail');
            }

            setProducts(res.products);


        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div
            onMouseEnter={() => setIsBeingHovered(true)}
            onMouseLeave={() => {
                setIsBeingHovered(false);
                setIsEditing(false);
            }}
            className={`relative w-[17rem] rounded-xl cursor-pointer transition-all duration-500
        bg-white p-4 flex flex-col justify-between shadow-md
        ${isBeingHovered ? "scale-105 shadow-lg -translate-y-1.5" : ""}
        ${isEditing ? "blur-sm opacity-50" : ""}
      `}
            onClick={toggleIsEditing}
        >
            {/* Status en haut à gauche */}
            <div className="absolute top-3 left-3">
                <span
                    className={`px-2 py-1 rounded-md text-xs font-semibold ${statusColors[status] || "bg-gray-200 text-gray-600"}`}
                >
                    {status}
                </span>
            </div>

            {/* Dates */}
            <div className="flex flex-col items-start gap-2 mt-6">
                <p className="text-sm text-gray-600">
                    <span className="font-medium">Delivering Date : </span>
                    {deliveringDate
                        ? new Date(deliveringDate).toLocaleDateString("fr-FR")
                        : "—"}
                </p>
                <p className="text-sm text-gray-600">
                    <span className="font-medium">Paid At : </span>
                    {paidAt ? new Date(paidAt).toLocaleDateString("fr-FR") : "—"}
                </p>
            </div>

            {/* OrderId en bas à droite */}
            <div className="absolute bottom-3 right-3 text-xs text-gray-500 font-medium">
                ID: {orderId}
            </div>

            {/* Mode édition flottant */}
            {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center gap-4 bg-white/70 rounded-xl">
                    <button className="p-2 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition">
                        🗑
                    </button>
                    <button className="p-2 bg-indigo-500 text-white rounded-full shadow hover:bg-indigo-600 transition">
                        ✏️
                    </button>
                </div>
            )}
        </div>
    );
};

export default OrderCard;