import React, { useState } from "react";
import {
  Crossicon,
  EditiconActionPopUp,
  Greenicon,
  Redcrossicon,
} from "../../assets/icon/Icons";
import { useServiceContext } from "../../store/ServiceContext";

function Actions({ selectedItem, handleOverlayClick }) {
  const [showRedIcons, setShowRedIcons] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [allSubcategories, setAllSubCategories] = useState(selectedItem);

  const { handleDeleteSubCategory, handleEditSubCategory } =
    useServiceContext();

  const handleEditClick = (index, value) => {
    if (editingIndex === index) {
      setEditingIndex(null);
    } else {
      setEditingIndex(index);
      setInputValues((prev) => ({
        ...prev,
        [index]: value,
      }));
    }
  };

  console.log(allSubcategories);

  const handleInputChange = (index, event) => {
    const value = event.target.value;

    setInputValues((prev) => ({
      ...prev,
      [index]: value,
    }));

    // Correct way to update the state
    setAllSubCategories((prevItems) => {
      console.log(prevItems, "prev Items"); // Logs before updating

      return prevItems.map((item, i) =>
        i === index ? { ...item, subCategoryName: value, id: item.id } : item
      );
    });
  };

  const handleSaveClick = async () => {
    // Update all edited subcategories
    for (const index in inputValues) {
      const id = allSubcategories[index].id; // Assuming each item has an id
      const updatedName =
        inputValues[index] || allSubcategories[index].subCategoryName;
      await handleEditSubCategory(id, updatedName);
    }

    // Delete subcategories marked for deletion
    const subCategoryIdsToDelete = allSubcategories
      .filter((item) => item.isMarkedForDeletion) // Assuming you have a way to mark for deletion
      .map((item) => item.id);

    for (const subCategoryId of subCategoryIdsToDelete) {
      await handleDeleteSubCategory(subCategoryId);
    }

    // Reset states
    setEditingIndex(null);
    setInputValues({});
    handleOverlayClick(); // Close the overlay
  };

  const handleDeleteClick = () => {
    setShowRedIcons(true);
  };

  const handleCancelClick = () => {
    setShowRedIcons(false);
  };

  const handleMarkForDeletion = (index) => {
    setAllSubCategories((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, isMarkedForDeletion: true } : item
      )
    );
  };

  let continuousIndex = 1;

  return (
    <div>
      <div className="w-[700px] bg-white absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 border border-gray-300 p-4 rounded-lg shadow-lg">
        <div className="text-end">
          <button
            onClick={handleOverlayClick}
            className="mb-5"
            aria-label="Close"
          >
            &#10005;
          </button>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[18px] font-medium">Profession</p>
          {showRedIcons ? (
            <div
              className="rounded-[10px] bg-[#0832DE] text-white px-[16px] py-2.5 h-[42px] font-normal text-[16px] cursor-pointer"
              onClick={handleCancelClick}
            >
              Cancel
            </div>
          ) : (
            <div
              className="bg-[#0832DE] py-2.5 h-[42px]  px-[15px] flex items-center rounded-[10px] cursor-pointer gap-3"
              onClick={handleDeleteClick}
            >
              <Crossicon className="bg-white" />
              <p className="font-normal text-white text-[16px] leading-[24px]">
                Delete
              </p>
            </div>
          )}
        </div>

        <div className="flex -mx-3 flex-row flex-wrap justify-between">
          {allSubcategories
            .filter((value) => !value.isMarkedForDeletion)
            .map(
              (item, index) => (
                console.log(item.categoryName, "item Name"),
                (
                  <div key={index} className="w-4/12 px-3">
                    <div className="flex items-center mt-[30px]">
                      <p className="me-[12px] font-normal text-[16px]">
                        {continuousIndex++}.
                      </p>
                      {editingIndex === index ? (
                        <input
                          type="text"
                          value={item.categoryName}
                          onChange={(e) => handleInputChange(index, e)}
                          className="font-normal text-[16px] me-[12px] cursor-pointer border border-[#000] rounded-[10px] py-[5px] px-[10px] w-[120px]"
                        />
                      ) : (
                        <p className="font-normal text-[16px] me-[12px] border border-transparent py-[5px] w-[120px]">
                          {item.categoryName}
                        </p>
                      )}
                      {showRedIcons ? (
                        <button onClick={() => handleMarkForDeletion(index)}>
                          <Redcrossicon />
                        </button>
                      ) : (
                        <span
                          onClick={() =>
                            handleEditClick(index, item.subCategoryName)
                          }
                        >
                          {editingIndex === index ? (
                            <button
                              onClick={() =>
                                handleEditSubCategory(
                                  item.id,
                                  inputValues[index] || item.subCategoryName
                                )
                              }
                            >
                              <Greenicon />
                            </button>
                          ) : (
                            <EditiconActionPopUp
                              onClick={() =>
                                handleEditClick(index, item.subCategoryName)
                              }
                            />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                )
              )
            )}
        </div>

        <button
          onClick={handleSaveClick}
          className="rounded-[10px] bg-[#0832DE] text-white w-full py-2.5 h-[42px] mt-[16px] font-normal text-[16px]"
        >
          Update status
        </button>
      </div>
    </div>
  );
}

export default Actions;
