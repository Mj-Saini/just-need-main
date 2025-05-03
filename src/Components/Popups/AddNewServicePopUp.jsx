/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { PlusIcon } from "../../assets/icon/Icon";
import { useServiceContext } from "../../store/ServiceContext";
import { toast } from "react-toastify";

function AddNewServicePopUp({ handleNewServicePopUp, onSuccess }) {
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [categoryImageUrl, setCategoryImageUrl] = useState("");
  const [categoryImageName, setCategoryImageName] = useState("");

  const { addCategoriesSubCategories, categories } = useServiceContext();

  const handleSaveDetails = async () => {
    if (!categoryName.trim()) {
      toast.error("Please enter a category name.");
      return;
    }

    // Check if the category name already exists
    const categoryExists = categories.some(
      (cat) => cat.categoryName.toLowerCase() === categoryName.toLowerCase()
    );

    if (categoryExists) {
      toast.info("A category with this name already exists.");
      return;
    }

    try {
      await addCategoriesSubCategories(categoryName, categoryImage);
      toast.success("Category added successfully!");
      // if (onSuccess) onSuccess(); // Trigger success callback
      handleNewServicePopUp(); // Close the popup
    } catch (error) {
      console.error("Error in handleSaveDetails:", error.message);
      toast.error(`Failed to add category: ${error.message}`);
    }
  };

  const handleCategoryImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const sizeInkb = 200 * 1024; // 200 KB in bytes
      if (file.size > sizeInkb) {
        toast.info("Image size exceeds 200 KB. Please upload a smaller file.");
        return;
      }
      setCategoryImage(file);
      setCategoryImageUrl(URL.createObjectURL(file));
      setCategoryImageName(file.name);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        onClick={handleNewServicePopUp}
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
      ></div>
      <div className="relative w-[500px] xl:w-[694px] bg-white rounded-lg shadow-lg p-6 max-h-[458px] overflow-y-auto">
        <button
          onClick={handleNewServicePopUp}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
          aria-label="Close"
        >
          ✕
        </button>
        <p className="font-normal text-lg text-black text-center pb-[15px] border-b-[0.5px] border-dashed border-[#00000066]">
          Add Service
        </p>
        <div className="mt-[15px]">
          <label
            htmlFor="serviceName"
            className="block text-base font-normal text-[#000000] mb-2.5"
          >
            Service Name
          </label>
          <input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            id="serviceName"
            name="serviceName"
            type="text"
            placeholder="Service Type"
            className="w-full px-3 py-[12px] bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-base placeholder:font-normal"
          />
        </div>
        <label
          className="block text-base font-normal text-[#000000] mb-2.5 mt-[15px]"
          htmlFor="imageText"
        >
          Category Image
        </label>
        <div className="flex items-center gap-2 bg-[#F2F2F2] rounded-lg p-2">
          <input
            type="text"
            value={
              categoryImage
                ? categoryImage.name
                : categoryImageName || "No Image Chosen"
            }
            placeholder="No Image Chosen"
            className="flex-1 px-3 py-2 bg-transparent border-none text-gray-500"
            disabled
          />
          <input
            type="file"
            className="hidden"
            id="fileUpload"
            accept="image/*"
            onChange={handleCategoryImage}
          />
          <label
            htmlFor="fileUpload"
            className="px-2.5 py-1 border border-[#E03F3F] text-[#E03F3F] rounded-lg cursor-pointer flex items-center"
          >
            <PlusIcon className="mr-1" />
            Upload
          </label>
        </div>
        {categoryImageUrl && (
          <img
            className="w-[58px] h-[58px] object-cover mt-2.5 rounded-[10px]"
            src={categoryImageUrl}
            alt={categoryImageName}
          />
        )}
        <button
          onClick={handleSaveDetails}
          className="w-full bg-[#0832DE] text-base text-white font-medium h-[42px] py-2.5 rounded-[10px] mt-[15px]"
        >
          Save Details
        </button>
      </div>
    </div>
  );
}

export default AddNewServicePopUp;