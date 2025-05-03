// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable no-undef */
// /* eslint-disable react/prop-types */
// import { useState, useRef, useEffect } from "react";
// import { ChromePicker } from "react-color";
// import { useSubscriptionContext } from "../../store/SubscriptionContext";

// function SuscriptionPopUp({ handlePopup, updateItemId }) {
//     const { addPlan, updatePlan, plans, loading } = useSubscriptionContext();

//     const initialData = {
//         planName: "",
//         price: "",
//         durationInDays: "",
//         currency: "₹",
//         color: "#0832DE",
//         cancellationPolicy: "",
//           features: [""]
//     };

//     const [subscriptionData, setSubscriptionData] = useState(initialData);
//     const [showColorPicker, setShowColorPicker] = useState(false);
//     const colorPickerRef = useRef(null);

//     useEffect(() => {
//         if (updateItemId) {
//             const existingPlan = plans.find(plan => plan.id === updateItemId);
//             if (existingPlan) {
//                 setSubscriptionData({
//                     planName: existingPlan.planName || "",
//                     price: existingPlan.price?.toString() || "",
//                     durationInDays: existingPlan.durationInDays?.toString() || "",
//                     currency: existingPlan.currency || "₹",
//                     color: existingPlan.color || "#0832DE",
//                     cancellationPolicy: existingPlan.cancellationPolicy || "", features: existingPlan.features || [""]
//                 });
//             }
//         } else {
//             setSubscriptionData(initialData);
//         }
//     }, [updateItemId, plans]);

//     const handleColorChange = (color) => {
//         setSubscriptionData(prev => ({
//             ...prev,
//             color: color.hex
//         }));
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setSubscriptionData(prev => ({ ...prev, [name]: value }));
//     };
//     const handleFeatureChange = (index, value) => {
//         const newFeatures = [...subscriptionData.features];
//         newFeatures[index] = value;
//         setSubscriptionData(prev => ({ ...prev, features: newFeatures }));
//     };

//     const addFeatureField = () => {
//         setSubscriptionData(prev => ({ ...prev, features: [...prev.features, ""] }));
//     };
//     const handleSubmit = async () => {
//         if (loading) return;

//         const payload = {
//             planName: subscriptionData.planName,
//             price: parseFloat(subscriptionData.price),
//             durationInDays: parseInt(subscriptionData.durationInDays),
//             currency: subscriptionData.currency,
//             color: subscriptionData.color,
//             cancellationPolicy: subscriptionData.cancellationPolicy
//         };

//         try {
//             if (updateItemId) {
//                 await updatePlan(payload, updateItemId);
//             } else {
//                 await addPlan(payload);
//             }
//             handlePopup(); // Close popup on success
//         } catch (error) {
//             console.error("Error saving subscription:", error);
//         }
//     };

//     useEffect(() => {
//         const handleClickOutside = (e) => {
//             if (colorPickerRef.current && !colorPickerRef.current.contains(e.target)) {
//                 setShowColorPicker(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     return (
//         <>
//             <div
//                 onClick={handlePopup}
//                 className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
//             />
//             <div className="fixed inset-0 flex items-center justify-center z-50 h-[458px] w-[500px] xl:w-[694px] m-auto">
//                 <div className="w-full bg-white rounded-lg shadow-lg p-6 relative">
//                     <button
//                         onClick={handlePopup}
//                         className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl"
//                         aria-label="Close"
//                     >
//                         ✕
//                     </button>
//                     <p className="font-normal text-lg text-black text-start pb-[15px] border-b-[0.5px] border-dashed border-[#00000066]">
//                         {updateItemId ? "Edit Subscription" : "Add Subscription"}
//                     </p>

//                     <div className="mt-[15px]">
//                         <label className="block text-base font-normal text-gray-700 mb-2.5">
//                             Subscription Name
//                         </label>
//                         <input
//                             name="planName"
//                             value={subscriptionData.planName}
//                             onChange={handleInputChange}
//                             placeholder="Standard"
//                             className="w-full px-3 py-[12px] rounded-[7px] bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     <div className="flex justify-between mt-[15px]">
//                         <div className="w-[25%]">
//                             <label className="block text-base font-normal text-gray-700 mb-2.5">
//                                 Currency
//                             </label>
//                             <div className="w-full pe-3 rounded-[7px] bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
//                                 <select
//                                     name="currency"
//                                     value={subscriptionData.currency}
//                                     onChange={handleInputChange}
//                                     className="w-full px-3 py-[12px] rounded-[7px] bg-gray-100 focus:outline-none"
//                                 >
//                                     <option value="₹">Ind (Rs)</option>
//                                     <option value="$">US Dollar ($)</option>
//                                     <option value="€">Euro (€)</option>
//                                     <option value="£">Pound (£)</option>
//                                 </select>
//                             </div>
//                         </div> <div className="w-[35%]">
//                             <label className="block text-base font-normal text-gray-700 mb-2.5">
//                                 Price
//                             </label>
//                             <input
//                                 name="price"
//                                 type="number"
//                                 value={subscriptionData.price}
//                                 onChange={handleInputChange}
//                                 placeholder="₹199.00"
//                                 className="w-full px-3 py-[12px] rounded-[7px] bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 onWheel={(e) => e.target.blur()}
//                             />
//                         </div>
//                         <div className="w-[35%]">
//                             <label className="block text-base font-normal text-gray-700 mb-2.5">
//                                 Duration (In years)
//                             </label>
//                             <input
//                                 name="durationInDays"
//                                 type="number"
//                                 value={subscriptionData.durationInDays}
//                                 onChange={handleInputChange}
//                                 placeholder="1"
//                                 className="w-full px-3 py-[12px] rounded-[7px] bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 onWheel={(e) => e.target.blur()}
//                             />
//                         </div>
//                     </div>



//                     <div className="mt-4">
//                         <div className="flex items-center justify-between">
//                             <label className="block text-base font-normal text-gray-700">Features</label>
//                             <button onClick={addFeatureField} className=" text-[#6C4DEF] px-4 py-2 rounded mt-2">+ Add Features</button>
// </div>
//                         {subscriptionData.features.map((feature, index) => (
//                             <input key={index} value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} placeholder="Feature" className="w-full px-3 py-2 rounded bg-gray-100 mb-2 focus:ring-2 focus:ring-blue-500" />
//                         ))}
//                     </div>

//                     <div className="mt-[15px] relative">
//                         <label className="block text-base font-normal text-gray-700 mb-2.5">
//                             Plan Color
//                         </label>
//                         <div className="flex items-center gap-2.5">
//                             <button
//                                 className="h-[42px] w-[163px] px-4 rounded-[10px] text-white"
//                                 style={{ backgroundColor: subscriptionData.color }}
//                                 onClick={() => setShowColorPicker(!showColorPicker)}
//                             >

//                             </button>
//                             <button
//                                 className="h-[42px] w-[calc(100%-163px)] text-start px-4 rounded-[10px] text-black/70 bg-[#F2F2F2]"

//                             >
//                                 {subscriptionData.color}
//                             </button>
//                             {showColorPicker && (
//                                 <div ref={colorPickerRef} className="absolute z-10 top-full mt-2">
//                                     <ChromePicker
//                                         color={subscriptionData.color}
//                                         onChange={handleColorChange}
//                                     />
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     <button
//                         onClick={handleSubmit}
//                         disabled={loading}
//                         className="w-full bg-[#0832DE] text-base text-white font-medium py-2.5 h-[42px] rounded-[10px] mt-[15px] disabled:opacity-50"
//                     >
//                         {loading ? "Saving..." : "Save Plan"}
//                     </button>
//                 </div>
//             </div>
//         </>
//     );
// }

// export default SuscriptionPopUp;


/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { ChromePicker } from "react-color";
import { useSubscriptionContext } from "../../store/SubscriptionContext";

function SuscriptionPopUp({ handlePopup, updateItemId }) {
    const { addPlan, updatePlan, plans, loading } = useSubscriptionContext();

    const initialData = {
        planName: "",
        price: "",
        durationInDays: "",
        currency: "₹",
        color: "#0832DE",
        cancellationPolicy: ""
    };

    const [subscriptionData, setSubscriptionData] = useState(initialData);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const colorPickerRef = useRef(null);

    useEffect(() => {
        if (updateItemId) {
            const existingPlan = plans.find(plan => plan.id === updateItemId);
            if (existingPlan) {
                setSubscriptionData({
                    planName: existingPlan.planName || "",
                    price: existingPlan.price?.toString() || "",
                    durationInDays: existingPlan.durationInDays?.toString() || "",
                    currency: existingPlan.currency || "₹",
                    color: existingPlan.color || "#0832DE",
                    cancellationPolicy: existingPlan.cancellationPolicy || ""
                });
            }
        } else {
            setSubscriptionData(initialData);
        }
    }, [updateItemId, plans]);

    const handleColorChange = (color) => {
        setSubscriptionData(prev => ({
            ...prev,
            color: color.hex
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSubscriptionData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        // Manual validation
        if (
            !subscriptionData.planName ||
            !subscriptionData.price ||
            !subscriptionData.durationInDays
        ) {
            alert('Please fill all required fields!');
            return;
        }

        const payload = {
            planName: subscriptionData.planName,
            price: parseFloat(subscriptionData.price),
            durationInDays: parseInt(subscriptionData.durationInDays),
            currency: subscriptionData.currency,
            color: subscriptionData.color,
            cancellationPolicy: subscriptionData.cancellationPolicy
        };

        try {
            if (updateItemId) {
                await updatePlan(payload, updateItemId);
            } else {
                await addPlan(payload);
            }
            handlePopup(); // Close popup on success
        } catch (error) {
            console.error("Error saving subscription:", error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (colorPickerRef.current && !colorPickerRef.current.contains(e.target)) {
                setShowColorPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <div
                onClick={handlePopup}
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 h-[458px] w-[500px] xl:w-[694px] m-auto">
                <div className="w-full bg-white rounded-lg shadow-lg p-6 relative">
                    <button
                        onClick={handlePopup}
                        className="absolute top-2 right-2 text-gray-600 hover:text-black"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                    <p className="font-normal text-lg text-black text-center pb-[15px] border-b-[0.5px] border-dashed border-[#00000066]">
                        {updateItemId ? "Edit Subscription" : "Add Subscription"}
                    </p>

                    <div className="mt-[15px]">
                        <label className="block text-base font-normal text-gray-700 mb-2.5">
                            Plan Name
                        </label>
                        <input
                            required
                            name="planName"
                            value={subscriptionData.planName}
                            onChange={handleInputChange}
                            placeholder="e.g. Premium Plan"
                            className="w-full px-3 py-[12px] rounded-[7px] bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex justify-between mt-[15px]">
                        <div className="w-[48%]">
                            <label className="block text-base font-normal text-gray-700 mb-2.5">
                                Price
                            </label>
                            <input
                                required
                                name="price"
                                type="number"
                                value={subscriptionData.price}
                                onChange={handleInputChange}
                                placeholder="Rs 1000.00 "
                                className="w-full px-3 py-[12px] rounded-[7px] bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onWheel={(e) => e.target.blur()}
                            />
                        </div>
                        <div className="w-[48%]">
                            <label className="block text-base font-normal text-gray-700 mb-2.5">
                                Duration (Days)
                            </label>
                            <input
                                required
                                name="durationInDays"
                                type="number"
                                value={subscriptionData.durationInDays}
                                onChange={handleInputChange}
                                placeholder="30"
                                className="w-full px-3 py-[12px] rounded-[7px] bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onWheel={(e) => e.target.blur()}
                            />
                        </div>
                    </div>

                    {/* <div className="mt-[15px]">
                        <label className="block text-base font-normal text-gray-700 mb-2.5">
                            Currency
                        </label>
                        <select
                            name="currency"
                            value={subscriptionData.currency}
                            onChange={handleInputChange}
                            className="w-full px-3 py-[12px] rounded-[7px] bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="₹">Indian Rupee (₹)</option>
                            <option value="$">US Dollar ($)</option>
                            <option value="€">Euro (€)</option>
                            <option value="£">Pound (£)</option>
                        </select>
                    </div> */}

                    <div className="mt-[15px]">
                        <label className="block text-base font-normal text-gray-700 mb-2.5">
                            Cancellation Policy
                        </label>
                        <textarea
                            name="cancellationPolicy"
                            value={subscriptionData.cancellationPolicy}
                            onChange={handleInputChange}
                            placeholder="Describe the cancellation policy..."
                            className="w-full px-3 py-[12px] rounded-[7px] bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                        />
                    </div>

                    <div className="mt-[15px] relative">
                        <label className="block text-base font-normal text-gray-700 mb-2.5">
                            Plan Color
                        </label>
                        <div className="flex items-center gap-2.5">
                            <span
                                className="h-[42px] flex justify-center items-center px-4 rounded-[10px] text-white"
                                style={{ backgroundColor: subscriptionData.color }}
                                onClick={() => setShowColorPicker(!showColorPicker)}
                            >
                                {subscriptionData.color}
                            </span>
                            {showColorPicker && (
                                <div ref={colorPickerRef} className="absolute z-10 top-full mt-2">
                                    <ChromePicker
                                        color={subscriptionData.color}
                                        onChange={handleColorChange}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-[#0832DE] text-base text-white font-medium py-2.5 h-[42px] rounded-[10px] mt-[15px] disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save Plan"}
                    </button>
                </div>
            </div>
        </>
    );
}

export default SuscriptionPopUp;