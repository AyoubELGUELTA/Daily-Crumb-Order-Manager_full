import React, { useEffect, useState } from 'react';
import UpdateClientCard from './UpdateClientCard';
import SearchBar from '../SearchBar';


const CardList = () => {
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [needRefresh, setNeedRefresh] = useState(true);
    const [needFilterRefresh, setNeedFilterRefresh] = useState(false);



    useEffect(() => {
        if (needRefresh) {
            fetchClients();
            setNeedRefresh(false)
        }
    }, [needRefresh]);

    const fetchClients = async () => {
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch(`/clients`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )

            const data = await res.json();
            console.log(data)
            if (!res.ok) {
                throw new Error(data.message || data.error || 'Error fetching clients');
            }
            setClients(data.clients);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };



    const getClients = async (clientId) => {
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch(`/clients/${clientId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Error fetching clients current infos');
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setNeedRefresh(true);
            setIsLoading(false);
        }
    }

    const handleDelete = async (clientId) => {

        const previousClients = clients;

        setClients(prev => prev.filter(p => p.id !== clientId));


        try {
            const response = await fetch(`/clients/${clientId}`,
                {
                    method: 'DELETE'
                }
            )

            console.log(clientId);
            if (!response.ok) {
                const errorData = await response.json();

                throw new Error(errorData.message || "Error occured.");
            }


            alert("Client successfully deleted.");

        }
        catch (error) {
            setClients(previousClients);
            setError(`Error: ${error.message}`)

        }

    }


    const handleOverlayClick = () => {
        setError('');
    };

    const handleSearchInput = async (userInput) => {
        setIsLoading(true);

        const params = new URLSearchParams();

        const queryName = userInput.queryName;
        const text = userInput.text

        if (text) {
            params.append({ queryName }, text);
        }



        try {
            const res = await fetch(`/clients?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Error fetching clients');
            }
            setClients(data.clients);

        } catch (err) {
            if (err.message === "No client found matching the criteria (or no client in the DB).") {
                setClients([]);
                return;
            }
            console.log(err);
        } finally {
            setIsLoading(false);
            setNeedFilterRefresh(false)
        }
    };


    return (


        <div className="flex flex-wrap gap-4">
            <h2 className="text-3xl font-bold mb-6 text-center">Products managing</h2>

            <SearchBar
                onSearchChange={handleSearchInput}
                needFilterRefresh={needFilterRefresh}
                setNeedFilterRefresh={setNeedFilterRefresh}

            />

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


            {clients.length > 0 ? (
                clients.map(client => (
                    <UpdateClientCard
                        key={client.id}
                        clientId={client.id}
                        clientName={client.name}
                        clientEmail={client.email}
                        clientCreatedDate={client.createdAt}
                        onDelete={handleDelete}
                        onGeneralChange={getClients}
                    />
                ))
            ) : (
                <p>No client found.</p>
            )}


        </div>

    );
}

export default CardList;
