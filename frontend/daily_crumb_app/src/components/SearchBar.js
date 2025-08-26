import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = ({
    placeholder = "Search...",
    onSearchChange,
    filterFields
}) => {
    const [searchValue, setSearchValue] = useState("");
    const [isFiltering, setIsFiltering] = useState(false);

    // useRef pour stocker la dernière valeur recherchée sans déclencher de rendu
    const lastFetchedValue = useRef("");

    useEffect(() => {
        // Condition pour arrêter si la valeur est vide
        if (searchValue.trim() === "") {
            // Optionnel : on peut vouloir vider les résultats
            if (lastFetchedValue.current !== "") {
                onSearchChange("");
                lastFetchedValue.current = "";
            }
            return;
        }

        // Si la valeur actuelle est la même que la dernière valeur recherchée, on arrête
        if (searchValue === lastFetchedValue.current) {
            return;
        }

        const timeout = setTimeout(() => {
            // onSearchChange est appelé seulement si la valeur a réellement changé
            onSearchChange(searchValue);
            lastFetchedValue.current = searchValue;
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchValue, onSearchChange]);

    const handleInputChange = (e) => {
        setSearchValue(e.target.value);
    };

    return (
        <div className="w-full max-w-lg mx-auto">
            <div className="flex items-center">
                <input
                    type="text"
                    value={searchValue}
                    placeholder={placeholder}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-3 border-2 border-black rounded-l-2xl text-lg focus:outline-none focus:ring-2 focus:ring-black"
                />

                <button
                    type="button"
                    onClick={() => setIsFiltering(!isFiltering)}
                    className={`px-6 py-3 font-semibold rounded-r-2xl transition-colors duration-200 ${isFiltering
                        ? "bg-gray-800 text-white"
                        : "bg-black text-white hover:bg-gray-900"
                        }`}
                >
                    Filter
                </button>
            </div>

            <AnimatePresence>
                {isFiltering && (
                    <motion.div
                        key="filter-panel"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-3 p-4 border-2 border-black rounded-2xl bg-white shadow-md">
                            {filterFields ? (
                                filterFields
                            ) : (
                                <p className="text-gray-500">No filters available.</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchBar;