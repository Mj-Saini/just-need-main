import React, { useState, useEffect } from "react";
import { useServiceContext } from "../../store/ServiceContext";

function AddSubCategoryPopUp({
  onCancel,
  selectedCategoryId,
  initialData,
  isEditMode,
}) {
  const [name, setName] = useState("");
  const { updateSubcategoryName, addSubcategory } = useServiceContext(); // Assume addSubcategory exists

  useEffect(() => {
    if (isEditMode && initialData) {
      setName(initialData.categoryName); // Pre-fill with existing name
    }
  }, [initialData, isEditMode]);

  const handleSubmit = () => {
    if (name.trim() !== "") {
      if (isEditMode) {
        updateSubcategoryName(initialData.id, name); // Update existing subcategory
      } else {
        // Assuming addSubcategory is a function in your context to add a new subcategory
        addSubcategory(selectedCategoryId, name);
      }
      onCancel(); // Close the popup
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[50] flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-lg font-medium">
          {isEditMode ? "Edit Subcategory" : "Add Subcategory"}
        </h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Subcategory Name"
          className="w-full border p-2 rounded-[10px] mt-2 focus:outline-none"
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={() => onCancel()}
            className="mr-2 text-gray-500 px-4 py-2 rounded-[10px]"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-[#0832DE] text-white px-4 py-2 rounded-[10px]"
          >
            {isEditMode ? "Save" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddSubCategoryPopUp;
