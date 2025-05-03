/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useServiceContext } from "../../store/ServiceContext";
import { PlusIcon } from "../../assets/icon/Icon";

function AddSubCategoryPopUp({
  handleClose,
  selectedCategoryId,
  isEditMode = false,
  initialData = {},
  onSuccess,
}) {
  const [subCategoryName, setSubCategoryName] = useState("");
  const [subcategoryImage, setSubcategoryImage] = useState(null);
  const [subcategoryImageUrl, setSubcategoryImageUrl] = useState("");
  const [subcategoryImageName, setSubcategoryImageName] = useState("");

  const { updateSubcategoryName, addSubcategory, categories } = useServiceContext();

  useEffect(() => {
    if (isEditMode && initialData) {
      setSubCategoryName(initialData.categoryName || "");
      setSubcategoryImageUrl(initialData.image || "");
      setSubcategoryImageName(initialData.image ? "Existing Image" : "");
    }
  }, [isEditMode, initialData]);

  const handleSubcategoryImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const sizeInkb = 200 * 1024; // 200 KB in bytes
      if (file.size > sizeInkb) {
        toast.info("Image size exceeds 200 KB. Please upload a smaller file.");
        return;
      }
      setSubcategoryImage(file);
      setSubcategoryImageUrl(URL.createObjectURL(file));
      setSubcategoryImageName(file.name);
    }
  };

  const handleSaveDetails = async () => {
    if (!subCategoryName.trim()) {
      toast.error("Please enter a subcategory name.");
      return;
    }
    // if (!subcategoryImage) {
    //   toast.error("Please enter a subcategory Image.");
    //   return;
    // }

    // Check if the subcategory name already exists in the selected category
    const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId);

    const subcategoryExists = Array.isArray(selectedCategory?.subcategory) &&
      selectedCategory.subcategory.some(
        (sub) =>
          sub?.categoryName?.toLowerCase() === subCategoryName.toLowerCase() &&
          sub.id !== initialData?.id
      );


    if (subcategoryExists) {
      toast.info("A subcategory with this name already exists in this category.");
      return;
    }

    try {
      if (isEditMode && initialData?.id) {
        const updatedData = { categoryName: subCategoryName };
        const success = await updateSubcategoryName(
          initialData.id,
          updatedData,
          subcategoryImage
        );
        if (success) {
          if (onSuccess) onSuccess();
          handleClose();
        } else {
          throw new Error("Update operation failed");
        }
      } else {
        if (!selectedCategoryId) {
          toast.error("Category ID is required to add a subcategory.");
          return;
        }
        await addSubcategory(selectedCategoryId, subCategoryName, subcategoryImage);
        toast.success("Subcategory added successfully!");
        // if (onSuccess) onSuccess();
        handleClose();
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "adding"} subcategory:`,
        error.message
      );
      toast.error(
        `Failed to ${isEditMode ? "update" : "add"} subcategory: ${error.message}`
      );
    }
  };

  return (
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
      ></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 w-[500px] xl:w-[694px] mx-auto">
        <div className="w-full bg-white rounded-lg shadow-lg p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-black"
            aria-label="Close"
          >
            ✕
          </button>
          <p className="font-normal text-lg text-black text-center pb-[15px] border-b border-dashed border-gray-400">
            {isEditMode ? "Edit Subcategory" : "Add Subcategory"}
          </p>

          <div className="mt-[15px]">
            <label className="block text-base font-normal text-gray-700 mb-2.5">
              Subcategory Name
            </label>
            <input
              value={subCategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
              type="text"
              placeholder="Enter Subcategory"
              className="w-full px-3 py-[12px] bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <label
            className="block text-base font-normal text-[#000000] mb-2.5 mt-[15px]"
            htmlFor="fileUpload"
          >
            Subcategory Image
          </label>
          <div className="flex items-center gap-2 bg-[#F2F2F2] rounded-lg p-2">
            <input
              required
              type="text"
              value={subcategoryImageName || ""}
              placeholder="No Image Chosen"
              className="flex-1 px-3 py-2 bg-transparent border-none text-gray-500"
              disabled
            />
            <input
              required
              type="file"
              className="hidden"
              id="fileUpload"
              accept="image/*"
              onChange={handleSubcategoryImage}
            />
            <label
              htmlFor="fileUpload"
              className="px-2.5 py-1 border border-[#E03F3F] text-[#E03F3F] rounded-lg cursor-pointer flex items-center"
            >
              <PlusIcon className="mr-1" />
              Upload
            </label>
          </div>

          {subcategoryImageUrl && (
            <img
              className="h-[58px] w-[58px] rounded-[10px] mt-2.5 object-cover"
              src={subcategoryImageUrl}
              alt={subcategoryImageName || "Subcategory Preview"}
            />
          )}

          <button
            onClick={handleSaveDetails}
            className="w-full bg-[#0832DE] text-base text-white font-medium h-[42px] py-2.5 rounded-[10px] mt-[15px]"
          >
            {isEditMode ? "Update Subcategory" : "Save Subcategory"}
          </button>
        </div>
      </div>
    </>
  );
}

export default AddSubCategoryPopUp;