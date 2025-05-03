/* eslint-disable react/prop-types */
import { useState } from "react";
import { Range } from "react-range";

const PriceRange = () => {
    const [values, setValues] = useState([100, 800]);

    return (
        <div className="text-white rounded-lg">
            <div className="mt-4 relative">
                {/* Price Labels */}
                <div className="flex justify-between text-sm text-gray-400">
                    <span>₹{values[1]}</span>
                    <span>₹{values[0]}</span>
                </div>

                {/* Slider */}
                <Range
                    step={10}
                    min={0}
                    max={1000}
                    values={values}
                    onChange={(newValues) => setValues(newValues)}
                    renderTrack={({ props, children }) => (
                        <div
                            {...props}
                            className="h-2 bg-[#6C4DEF1A] rounded-md mt-2 relative"
                        >
                            <div
                                className="absolute top-0 left-0 h-2 bg-[#6C4DEF] rounded-md"
                                style={{
                                    width: `${((values[1] - values[0]) / 1000) * 100}%`,
                                    left: `${(values[0] / 1000) * 100}%`,
                                }}
                            />
                            {children}
                        </div>
                    )}
                    renderThumb={({ props }) => (
                        <div
                            {...props}
                            className="w-5 h-5 bg-[rgba(108, 77, 239, 1)] rounded-full border-2 border-white shadow-lg"
                        />
                    )}
                />

                {/* Min & Max Price Labels */}
                <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>₹0</span>
                    <span>₹1000</span>
                </div>
            </div>
        </div>
    );
};

export default PriceRange;


// import { useState, useEffect } from "react";
// import { Range } from "react-range";

// const PriceRange = ({ onPriceChange, initialPriceRange }) => {
//     const [values, setValues] = useState(initialPriceRange);

//     useEffect(() => {
//         onPriceChange(values); // Update the price range in the parent component
//     }, [values, onPriceChange]);

//     return (
//         <div className="text-white rounded-lg">
//             <div className="mt-4 relative">
//                 {/* Price Labels */}
//                 <div className="flex justify-between text-sm text-gray-400">
//                     <span>₹{values[1]}</span>
//                     <span>₹{values[0]}</span>
//                 </div>

//                 {/* Slider */}
//                 <Range
//                     step={10}
//                     min={0}
//                     max={1000}
//                     values={values}
//                     onChange={(newValues) => setValues(newValues)}
//                     renderTrack={({ props, children }) => (
//                         <div
//                             {...props}
//                             className="h-2 bg-[#6C4DEF1A] rounded-md mt-2 relative"
//                         >
//                             <div
//                                 className="absolute top-0 left-0 h-2 bg-[#6C4DEF] rounded-md"
//                                 style={{
//                                     width: `${((values[1] - values[0]) / 1000) * 100}%`,
//                                     left: `${(values[0] / 1000) * 100}%`,
//                                 }}
//                             />
//                             {children}
//                         </div>
//                     )}
//                     renderThumb={({ props }) => (
//                         <div
//                             {...props}
//                             className="w-5 h-5 bg-[rgba(108, 77, 239, 1)] rounded-full border-2 border-white shadow-lg"
//                         />
//                     )}
//                 />

//                 {/* Min & Max Price Labels */}
//                 <div className="flex justify-between text-sm text-gray-400 mt-2">
//                     <span>₹0</span>
//                     <span>₹1000</span>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PriceRange;
