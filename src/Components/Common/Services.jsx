/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  Editicon,
  Plusicon,
  DisableRedicon,
  Searchicon,
  EnableRedIcon,
} from "../../assets/icon/Icons";
import Actions from "../Popups/Actions";
import AddNewServicePopUp from "../Popups/AddNewServicePopUp";
import DisablePopUp from "../Popups/DisablePopUp";
import { useServiceContext } from "../../store/ServiceContext";
import AddSubCategoryPopUp from "../Popups/SubcategoryPopup";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import Loader from "./Loader";
import { PlusIcon, SearchingIcon, UnderIcon } from "../../assets/icon/Icon";
import { supabase } from "../../store/supabaseCreateClient";

function Services() {
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showNewServicePopUp, setShowNewServicePopUp] = useState(false);
  const [showDisablePopup, setShowDisablePopup] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(null);
  const [isCategoryToggle, setIsCategoryToggle] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [subcategoryPopup, setSubCategoryPopup] = useState(false);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingSubcategoryId, setEditingSubcategoryId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [categoryImage, setCategoryImage] = useState(null); // State for category image
  const [categoryImageUrl, setCategoryImageUrl] = useState(""); // State for image URL

  const [isVertical, setIsVertical] = useState(false);

  const toggleLayout = () => {
    setIsVertical((prev) => !prev);
  };

  const {
    categories = [],
    updateSubcategoryName,
    toggleSubcategoryStatus,
    getCategoriesWithSubcategories,
    updateCategoryName,
    addSubcategory,
    toggleCategoryStatus,
    loading,
  } = useServiceContext();

  useEffect(() => {
    getCategoriesWithSubcategories().catch((error) => {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to load categories. Please refresh the page.");
    });
  }, []);

  const handleCategoryImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxSizeInBytes = 1 * 1024 * 1024; // 1 MB
      if (file.size > maxSizeInBytes) {
        toast.error("Image size exceeds 1 MB. Please upload a smaller file.");
        return;
      }
      setCategoryImage(file);
      setCategoryImageUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (categories.length > 0 && !loading) {
      const firstActiveCategory =
        categories.find((cat) => cat.isActive) || categories[0];

      const validSubcategories = (firstActiveCategory?.subcategory || []).filter(
        (sub) => sub?.id && sub?.categoryName && sub?.catID
      );

      const index = categories.indexOf(firstActiveCategory);
      setActiveTab(index);
      setSelectedSubcategories(validSubcategories);
      setSelectedCategoryId(firstActiveCategory?.id || null);
    }
  }, [categories, loading]);

  const filteredCategoriesData = useMemo(() => {
    if (!searchQuery.trim()) {
      return categories
        .filter((cat) => cat.isActive)
        .map((category) => ({
          ...category,
          subcategory: (category.subcategory || []).filter((sub) => sub.isActive),
        }))
        .filter((cat) => cat.subcategory.length > 0);
    }

    return categories
      .map((category) => {
        if (!category.isActive) return null;

        const categoryMatches = category?.categoryName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

        const filteredSubcategories = (category.subcategory || []).filter(
          (sub) =>
            sub.isActive &&
            sub?.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (categoryMatches || filteredSubcategories.length > 0) {
          return {
            ...category,
            subcategory:
              filteredSubcategories.length > 0 || categoryMatches
                ? filteredSubcategories
                : [],
          };
        }
        return null;
      })
      .filter((cat) => cat !== null && cat.subcategory.length > 0);
  }, [categories, searchQuery]);

  // const filteredCategoriesData = useMemo(() => {
  //   if (!searchQuery.trim()) return categories;

  //   return categories
  //     .map((category) => {
  //       const categoryMatches = category?.categoryName
  //         ?.toLowerCase()
  //         .includes(searchQuery.toLowerCase());
  //       const filteredSubcategories = (category.subcategory || []).filter(
  //         (sub) =>
  //           sub?.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
  //       );

  //       if (categoryMatches || filteredSubcategories.length > 0) {
  //         return {
  //           ...category,
  //           subcategory:
  //             filteredSubcategories.length > 0 || categoryMatches
  //               ? category.subcategory
  //               : [],
  //         };
  //       }
  //       return null;
  //     })
  //     .filter((cat) => cat !== null);
  // }, [categories, searchQuery]);

  const toggle = useCallback(() => {
    setShowForm((prev) => {
      if (!prev) {
        setCategoryName("");
        setEditingCategoryId(null);
        setEditingSubcategoryId(null);
        setCategoryImage(null); // Reset image when closing form
        setCategoryImageUrl(""); // Reset image URL when closing form
      }
      return !prev;
    });
  }, []);

  const handleNewServicePopUp = useCallback(() => {
    setShowNewServicePopUp((prev) => !prev);
  }, []);

  const handleSubcategory = useCallback(() => {
    setSubCategoryPopup((prev) => !prev);
  }, []);

  const handleEditClick = useCallback((index, categoryName) => {
    setEditIndex(index);
    setEditData(categoryName || "");
  }, []);

  const handleInputChange = useCallback((e) => {
    setEditData(e.target.value);
  }, []);

  const handleSaveEdit = useCallback(
    async (subcategoryId) => {
      if (editData.trim() !== "") {
        try {
          const currentSubcategory = selectedSubcategories.find(
            (sub) => sub.id === subcategoryId
          );
          const newStatus = !currentSubcategory?.isActive;

          const nameSuccess = await updateSubcategoryName(
            subcategoryId,
            editData
          );
          const statusSuccess = await toggleSubcategoryStatus(
            subcategoryId,
            newStatus
          );

          if (nameSuccess && statusSuccess) {
            setEditIndex(null);
            setEditData("");
            setSelectedSubcategories((prev) =>
              prev.map((sub) =>
                sub.id === subcategoryId
                  ? { ...sub, categoryName: editData, isActive: newStatus }
                  : sub
              )
            );
            await getCategoriesWithSubcategories();
            toast.success(
              `Subcategory updated and ${newStatus ? "enabled" : "disabled"} successfully!`
            );
          } else {
            toast.error("Failed to update subcategory or toggle status.");
          }
        } catch (error) {
          console.error("Error updating subcategory:", error);
          toast.error("An error occurred while updating the subcategory.");
        }
      }
    },
    [
      editData,
      updateSubcategoryName,
      toggleSubcategoryStatus,
      selectedSubcategories,
      getCategoriesWithSubcategories,
    ]
  );

  const handleCategoryInputChange = useCallback((e) => {
    setCategoryName(e.target.value);
  }, []);

  const handleSaveEditPopup = useCallback(async () => {
    if (categoryName.trim() === "") {
      toast.error("Name cannot be empty.");
      return;
    }

    try {
      if (editingCategoryId) {
        // Update category name
        const nameSuccess = await updateCategoryName(editingCategoryId, categoryName);

        // Update category image if a new image is uploaded
        let imageSuccess = true;
        if (categoryImage) {
          const fileExt = categoryImage.name.split(".").pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `category-images/${fileName}`;

          // Upload image to Supabase storage
          const { data: imageData, error: imageError } = await supabase.storage
            .from("just_need") // Replace with your actual bucket name
            .upload(filePath, categoryImage, {
              cacheControl: "3600",
              upsert: false,
            });

          if (imageError) throw new Error("Image upload failed: " + imageError.message);

          const { data: publicUrlData } = supabase.storage
            .from("just_need")
            .getPublicUrl(filePath);

          if (!publicUrlData?.publicUrl) throw new Error("Failed to get public URL");

          // Update the category with the new image URL in the database
          const { error: updateError } = await supabase
            .from("categories") // Replace with your actual table name
            .update({ image: publicUrlData.publicUrl })
            .eq("id", editingCategoryId);

          if (updateError) throw new Error("Failed to update category image: " + updateError.message);

          imageSuccess = true;
        }

        if (nameSuccess && imageSuccess) {
          toast.success("Category updated successfully!");
          await getCategoriesWithSubcategories();
          toggle();
        } else {
          toast.error("Failed to update category.");
        }
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error(`An error occurred: ${error.message}`);
    }
  }, [
    categoryName,
    categoryImage,
    editingCategoryId,
    updateCategoryName,
    getCategoriesWithSubcategories,
    toggle,
  ]);

  const handleOverlayClick = useCallback(() => {
    setShowPopup(false);
    setSelectedItem(null);
  }, []);

  const toggleDisableCard = useCallback(
    async (itemId, currentStatus, action, isCategory = false) => {
      if (action === "confirm") {
        setShowDisablePopup(false);
        setCurrentCardIndex(null);
        if (showForm) toggle();

        const newStatus = !currentStatus;
        try {
          if (isCategory) {
            await toggleCategoryStatus(itemId, newStatus);
            const updatedCategories = categories.map((cat) =>
              cat.id === itemId ? { ...cat, isActive: newStatus } : cat
            );
            const activeCategoryIndex = updatedCategories.findIndex(
              (cat) => cat.isActive
            );
            if (newStatus) {
              const enabledIndex = updatedCategories.findIndex(
                (cat) => cat.id === itemId
              );
              setActiveTab(enabledIndex);
              setSelectedSubcategories(
                updatedCategories[enabledIndex]?.subcategory || []
              );
              setSelectedCategoryId(
                updatedCategories[enabledIndex]?.id || null
              );
            } else if (
              activeTab === categories.findIndex((cat) => cat.id === itemId)
            ) {
              setActiveTab(
                activeCategoryIndex !== -1 ? activeCategoryIndex : 0
              );
              setSelectedSubcategories(
                activeCategoryIndex !== -1
                  ? updatedCategories[activeCategoryIndex]?.subcategory || []
                  : []
              );
              setSelectedCategoryId(
                activeCategoryIndex !== -1
                  ? updatedCategories[activeCategoryIndex]?.id || null
                  : null
              );
            }
          } else {
            await toggleSubcategoryStatus(itemId, newStatus);
            setSelectedSubcategories((prev) =>
              prev.map((sub) =>
                sub.id === itemId ? { ...sub, isActive: newStatus } : sub
              )
            );
          }
          await getCategoriesWithSubcategories();
          toast.success(
            newStatus
              ? `${isCategory ? "Category" : "Subcategory"} enabled successfully!`
              : `${isCategory ? "Category" : "Subcategory"} disabled successfully!`
          );
        } catch (error) {
          console.error(
            `Error toggling ${isCategory ? "category" : "subcategory"} status:`,
            error
          );
          toast.error(
            `Failed to toggle ${isCategory ? "category" : "subcategory"} status: ${error.message}`
          );
        }
      } else {
        setShowDisablePopup(false);
        setCurrentCardIndex(null);
      }
    },
    [
      toggleSubcategoryStatus,
      toggleCategoryStatus,
      getCategoriesWithSubcategories,
      showForm,
      toggle,
      categories,
      activeTab,
    ]
  );

  const handleCategoryClick = useCallback(
    (index) => {
      const sourceArray = searchQuery.trim()
        ? filteredCategoriesData
        : categories;

      if (sourceArray[index]?.isActive) {
        const updatedArray = [
          sourceArray[index],
          ...sourceArray.filter((_, i) => i !== index),
        ];

        setActiveTab(index);
        setSelectedSubcategories(sourceArray[index]?.subcategory || []);
        setSelectedCategoryId(sourceArray[index]?.id || null);

        setIsVertical(false);
      }
    },
    [categories, filteredCategoriesData, searchQuery]
  );

  const handleCategoryEdit = useCallback((categoryId, currentName, e) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditingCategoryId(categoryId);
    setEditingSubcategoryId(null);
    setCategoryName(currentName || "");
    // Set the current category image URL when editing starts
    const currentCategory = categories.find((cat) => cat.id === categoryId);
    setCategoryImageUrl(currentCategory?.image || ""); // Pre-populate with existing image URL
    setCategoryImage(null); // Reset uploaded image to null
    setShowForm(true);
  }, [categories]);

  const handleSubcategoryEdit = useCallback((subcategoryId, currentName, e) => {
    e.stopPropagation();
    setEditingSubcategoryId(subcategoryId);
    setEditingCategoryId(null);
    setCategoryName(currentName || "");
    setShowForm(true);
  }, []);

  const handleDisableClick = useCallback(
    (subcategoryId) => {
      setCurrentCardIndex(subcategoryId);
      setIsCategoryToggle(false);
      setShowDisablePopup(true);
      if (showForm) toggle();
    },
    [showForm, toggle]
  );

  const handleCategoryDisable = useCallback(
    (categoryId) => {
      setCurrentCardIndex(categoryId);
      setIsCategoryToggle(true);
      setShowDisablePopup(true);
      if (showForm) toggle();
    },
    [showForm, toggle]
  );
  const confirmUnblock = () => {
    const updatedCategories = categories.map((category) => {
      return {
        ...category,
        subcategory: category.subcategory?.map((sub) => {
          if (sub.id === currentCardIndex) {
            return { ...sub, isActive: true }; // 👈 unblocking
          }
          return sub;
        }),
      };
    });

    setCategories(updatedCategories); // 👈 this updates the UI
    setShowDisablePopup(false); // close the popup
  };


  const toggleOptionsVisibility = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  const blockedSubcategories = useMemo(() => {
    return categories
      .flatMap((category) => category.subcategory || [])
      .filter((sub) => sub.isActive === false);
  }, [categories]);

  const popupRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        toggle();
      }
    };
    if (showForm) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showForm, toggle]);

  const handleNewServiceSuccess = async () => {
    toast.success("New service added successfully!");
    await getCategoriesWithSubcategories();
    handleNewServicePopUp();
    const newCategoryIndex = categories.length - 1;
    setActiveTab(newCategoryIndex);
    setSelectedSubcategories([]);
    setSelectedCategoryId(categories[newCategoryIndex]?.id || null);
  };

  const handleSubcategorySuccess = async () => {
    toast.success("Subcategory added successfully!");
    await getCategoriesWithSubcategories();
    handleSubcategory();
  };

  const highlightText = (text, query) => {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="p-[14px] rounded-[10px] shadow-md bg-white">
      {!categories && (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <Loader />
          </div>
        </div>
      )}
      {!loading && categories.length === 0 && <p>No categories available.</p>}
      {!loading && categories.length >= 0 && (
        <>
          <div className="xl:flex-row flex-col flex xl:items-center justify-between">
            <h1 className="font-medium text-[22px]">{categories[activeTab]?.categoryName}</h1>
            <div className="flex items-center mt-[20px] xl:mt-[0px]">
              <div className="bg-[#F1F1F1] w-[337px] px-[16px] py-2.5 h-[42px] rounded-[10px]">
                <div className="flex items-center">
                  <Searchicon />
                  <input
                    className="text-[16px] font-normal outline-none ms-[10px] bg-transparent"
                    type="text"
                    placeholder="Search Task"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div
                onClick={handleNewServicePopUp}
                className="whitespace-nowrap cursor-pointer bg-[#0832DE] flex items-center h-[42px] px-[16px] py-2.5 rounded-[10px] ms-[20px]"
              >
                <Plusicon />
                <p className="font-normal text-[16px] text-white ms-[12px]">
                  Add New Service
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 relative">
            <div className={`flex whitespace-nowrap ${isVertical ? "border-b border-[rgb(128,128,128)]" : ""}`}>
              <div
                className={`gap-4 flex items-center grid-3 cursor-pointer scrollRemove border-b-2 ${isVertical ? "flex-wrap" : "overflow-x-auto "}`}
              >
                {filteredCategoriesData?.map((items, index) => (
                  <div
                    key={index}
                    className={`flex items-center pb-2 ${!isVertical ? "border-b-2" : ""} px-5 hover:text-blue-500 hover:border-blue-500 ${activeTab === index
                      ? "border-blue-500 text-blue-500"
                      : "border-transparent text-gray-700"
                      } ${!items.isActive ? "opacity-50" : ""}`}
                    onClick={() => handleCategoryClick(index)}
                  >
                    <img
                      className="h-[30px] w-[30px] object-cover rounded-full"
                      src={items.image}
                      alt=""
                    />
                    <p className="font-normal text-base transition mx-[5px]">
                      {highlightText(items?.categoryName)}
                    </p>
                    <span className="font-normal text-xs flex justify-center items-center w-[25px] h-[17px] bg-[#0000000F] rounded-[60px] py-1 px-1.5 me-1">
                      {items?.subcategory?.length || 0}
                    </span>

                    <div className="flex gap-2">
                      <div
                        onClick={(e) =>
                          handleCategoryEdit(items.id, items.categoryName, e)
                        }
                      >
                        <Editicon />
                      </div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCategoryDisable(items.id);
                        }}
                        className="ms-2"
                      >
                        {items.isActive ? <EnableRedIcon /> : <DisableRedicon />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex">
                <div
                  className={`cursor-pointer ps-5 flex flex-col justify-start mt-3 ${!isVertical ? "border-b border-[rgb(128,128,128)]" : ""}`}
                  onClick={toggleLayout}
                >
                  <UnderIcon />
                </div>

                <div
                  className={`bg-white ps-5 ${!isVertical ? "border-b border-[rgb(128,128,128)]" : ""}`}
                >
                  <button
                    className="text-[#6C4DEF] font-normal text-base"
                    onClick={toggleOptionsVisibility}
                  >
                    View Blocked List
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-between gap-[18px] mt-6 flex-wrap whitespace-nowrap">
            {selectedSubcategories?.length > 0 &&
              selectedSubcategories?.map((sub, index) => (
                <div
                  key={index}
                  className="group hover:bg-[#6C4DEF1A] hover:border-[#6CDEF1A] border border-[#0000001A] lg:p-5 p-3 rounded-[10px] h-full transition w-full"
                >
                  <div className="flex items-center justify-between">
                    {editIndex === index ? (
                      <input
                        type="text"
                        value={editData}
                        onChange={handleInputChange}
                        onBlur={() => handleSaveEdit(sub.id)}
                        className="w-full bg-transparent border border-black me-2 focus:outline-none p-1 rounded-[10px]"
                        autoFocus
                      />
                    ) : (
                      <p className="font-normal text-sm text-[#00000099] lg:mx-[5px] transition group-hover:text-[#6C4DEF] flex items-center lg:gap-4 gap-2">
                        <img
                          className="w-[25px] h-[25px] object-cover rounded-full"
                          src={sub.image}
                          alt=""
                        />
                        {highlightText(sub?.categoryName, searchQuery)}
                      </p>
                    )}

                    <div className="flex lg:gap-4 gap-2">
                      <div
                        className="cursor-pointer"
                        onClick={(e) => handleSubcategoryEdit(sub.id, sub.categoryName, e)}
                      >
                        <Editicon />
                      </div>
                      <div onClick={() => handleDisableClick(sub.id)} className="cursor-pointer">
                        {sub.isActive ? <EnableRedIcon /> : <DisableRedicon />}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {selectedSubcategories?.length === 0 && (
            <div className="flex flex-col">
              <div className="flex justify-center">
                <SearchingIcon />
              </div>
              <div className="flex justify-center">
                <p className="font-normal text-[28px] text-black">
                  No Sub-Category Found
                </p>
              </div>
            </div>
          )}

          <div className="inline-block mt-8">
            <div
              onClick={handleSubcategory}
              className="whitespace-nowrap cursor-pointer bg-[#0832DE] flex items-center h-[42px] px-[16px] py-2.5 rounded-[10px]"
            >
              <Plusicon />
              <p className="font-normal text-[16px] text-white ms-[12px]">
                Add New Sub-Category
              </p>
            </div>
          </div>

          {showPopup && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-[50] flex items-center justify-center"
              onClick={handleOverlayClick}
            >
              <div
                className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Actions
                  selectedItem={selectedItem}
                  handleOverlayClick={handleOverlayClick}
                />
              </div>
            </div>
          )}
          {showNewServicePopUp && (
            <AddNewServicePopUp
              handleNewServicePopUp={handleNewServicePopUp}
              onSuccess={handleNewServiceSuccess}
            />
          )}
          {subcategoryPopup && (
            <AddSubCategoryPopUp
              handleClose={handleSubcategory}
              selectedCategoryId={selectedCategoryId}
              isEditMode={false}
              initialData={null}
              onSuccess={handleSubcategorySuccess}
            />
          )}
          {showDisablePopup && (
            <DisablePopUp
              onConfirm={() =>
                toggleDisableCard(
                  currentCardIndex,
                  isCategoryToggle
                    ? categories.find((cat) => cat.id === currentCardIndex)?.isActive
                    : selectedSubcategories.find((sub) => sub.id === currentCardIndex)?.isActive,
                  "confirm",
                  isCategoryToggle
                )
              }
              onCancel={() => setShowDisablePopup(false)}
              isActive={
                isCategoryToggle
                  ? categories.find((cat) => cat.id === currentCardIndex)?.isActive
                  : selectedSubcategories.find((sub) => sub.id === currentCardIndex)?.isActive
              }
              confirmText={
                isCategoryToggle &&
                  !categories.find((cat) => cat.id === currentCardIndex)?.isActive
                  ? "Yes Enable"
                  : "Yes Disable"
              }
            />
          )}

          <div className="flex justify-center items-center">
            {isVisible && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
                onClick={() => setIsVisible(false)}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="w-[401px] bg-white shadow-lg rounded-lg flex flex-col"
                >
                  <div className="fixed z-10 w-[400px]">
                    <div className="p-4 bg-[#EEEEEE] flex justify-between items-center rounded-t-lg">
                      <span className="font-normal text-base">
                        Blocked Services
                      </span>
                      <button
                        onClick={() => setIsVisible(false)}
                        className="focus:outline-none me-1"
                      >
                        <AiOutlineClose size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="py-2.5 px-5 h-[250px] overflow-y-scroll pt-14">
                    {blockedSubcategories.length === 0 ? (
                      <p className="text-[#999999] font-normal text-base py-2">
                        No blocked subcategories found.
                      </p>
                    ) : (
                      blockedSubcategories.map((sub, index) => (
                        <div
                          key={sub.id}
                          className="flex justify-between items-center py-2"
                        >
                          <div
                            className={`flex items-center ${index === 0 ? "mt-3" : ""}`}
                          >
                            <label className="custom-radio">
                              <input type="radio" name="blockedService" />
                            </label>
                            <span className="text-[#999999] font-normal text-base px-2.5">
                              {highlightText(
                                sub.categoryName || "Unnamed Subcategory",
                                searchQuery
                              )}
                            </span>
                          </div>
                          <div onClick={(e) => {
                            e.stopPropagation();
                            handleCategoryDisable(sub.id);
                          }}>
                            <DisableRedicon />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {showForm && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                <div
                  ref={popupRef}
                  className="bg-white p-6 rounded-lg w-[649px] shadow-lg relative"
                >
                  <div className="flex justify-center items-center border-b pb-6">
                    <h2 className="text-lg font-semibold">
                      {editingCategoryId ? "Edit Category" : "Edit Subcategory"}
                    </h2>
                    <button
                      onClick={toggle}
                      className="text-gray-600 hover:text-black absolute right-6 top-4"
                    >
                      <AiOutlineClose size={20} />
                    </button>
                  </div>
                  <div className="mt-6">
                    <label className="block text-base font-normal text-[#000000]">
                      {editingCategoryId ? "Category Name" : "Subcategory Name"}
                    </label>
                    <input
                      type="text"
                      value={categoryName}
                      onChange={handleCategoryInputChange}
                      className="w-full mt-[10px] p-2 border rounded text-[#000000] focus:outline-none"
                      placeholder={
                        editingCategoryId
                          ? "Enter category name"
                          : "Enter subcategory name"
                      }
                    />
                  </div>

                  {editingCategoryId && (
                    <>
                      <label
                        className="block text-base font-normal text-[#000000] mb-2.5 mt-[15px]"
                        htmlFor="imageText"
                      >
                        Category Image
                      </label>
                      <div className="flex items-center gap-2 bg-[#F2F2F2] rounded-lg p-2">
                        <input
                          type="text"
                          placeholder={categoryImageUrl ? "Image Uploaded" : "No Image Chosen"}
                          value={categoryImageUrl ? "Image Uploaded" : "No Image Chosen"} // Reflect the current state
                          className="flex-1 px-3 py-2 bg-transparent border-none text-gray-500"
                          disabled
                        />
                        <input
                          type="file"
                          className="hidden"
                          id="fileUpload"
                          accept="image/*"
                          onChange={handleCategoryImageChange}
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
                          src={categoryImageUrl}
                          alt="Category Preview"
                          className="mt-2 w-[100px] h-[100px] object-cover rounded-lg"
                        />
                      )}
                    </>
                  )}

                  <button
                    onClick={handleSaveEditPopup}
                    className="w-full bg-[#0832DE] font-normal text-base text-white mt-6 py-2 rounded-[10px]"
                  >
                    Save Details
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Services;