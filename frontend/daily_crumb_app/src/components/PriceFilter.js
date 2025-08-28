import React from 'react';
import { Range } from 'react-range';

const PriceFilter = ({ priceRange, setPriceRange, setNeedFilterRefresh }) => {

    const handleRangeChange = (newValues) => {
        setPriceRange(newValues);
        setNeedFilterRefresh(true);
    };

    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold mb-4">Filter by price</h3>
            <div className="flex justify-between items-center mb-4 text-gray-700">
                <span>{priceRange[0]}€</span>
                <span>{priceRange[1]}€</span>
            </div>
            <Range
                step={5}
                min={0}
                max={500}
                values={priceRange}
                onChange={(values) => handleRangeChange(values)}
                renderTrack={({ props, children }) => (
                    <div {...props} className="w-full h-1 bg-gray-300 rounded-full">
                        {children}
                    </div>
                )}
                renderThumb={({ props }) => (
                    <div {...props} className="w-5 h-5 bg-black rounded-full shadow-lg" />
                )}
            />
        </div>
    );
}

export default PriceFilter;

