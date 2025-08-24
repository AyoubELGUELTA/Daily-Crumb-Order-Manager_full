import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = ({
    placeholder = "Search...",
    onSearchChange,
    filterFields // un ReactNode (inputs, selects...) passé en props
}) => {
    const [isFiltering, setIsFiltering] = useState(false);

    return (
        <div className="w-full max-w-lg mx-auto">
            {/* Search bar + bouton filter */}
            <div className="flex items-center">
                <input
                    type="text"
                    placeholder={placeholder}
                    onChange={onSearchChange}
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

            {/* Panel de filtres animé */}
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
