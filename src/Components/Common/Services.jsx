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
import { useUserContext } from "../../store/UserContext";
import { useCustomerContext } from "../../store/CustomerContext";

function Services() {
  const { sendNotification } = useUserContext();
  const { users } = useCustomerContext();
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
  const [subCat, setSubCat] = useState(null);
  const [isVertical, setIsVertical] = useState(false);
  const [activeServiceTab, setActiveServiceTab] = useState("services");

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
      return categories.filter(cat => cat.isActive !== false);
    }

    return categories
      .filter(cat => cat.isActive !== false)
      .map((category) => {
        const categoryMatches = category?.categoryName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
        const filteredSubcategories = (category.subcategory || [])
          .filter(sub => sub.isActive !== false)
          .filter((sub) =>
            sub?.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
          );

        if (categoryMatches || filteredSubcategories.length > 0) {
          return {
            ...category,
            subcategory: filteredSubcategories.length > 0 || categoryMatches
              ? filteredSubcategories
              : [],
          };
        }
        return null;
      })
      .filter((cat) => cat !== null);
  }, [categories, searchQuery]);



  const toggle = useCallback(() => {
    setShowForm((prev) => {
      if (!prev) {
        setCategoryName("");
        setEditingCategoryId(null);
        setEditingSubcategoryId(null);
        setCategoryImage(null);
        setCategoryImageUrl("");
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
    console.log(editingCategoryId, "editingCategoryId")
    try {
      if (editingCategoryId) {
        // 🟢 Category update
        let imageUrl = categoryImageUrl;

        // Upload new image if one was selected
        if (categoryImage) {
          // Delete old image if it exists
          if (categoryImageUrl) {
            try {
              const oldImagePath = categoryImageUrl.split('/').pop();
              await supabase.storage
                .from("just_need")
                .remove([`category-images/${oldImagePath}`]);
            } catch (cleanupError) {
              console.warn("Failed to delete old image:", cleanupError);
            }
          }

          // Upload new image
          const fileExt = categoryImage.name.split('.').pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `category-images/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("just_need")
            .upload(filePath, categoryImage);

          if (uploadError) throw uploadError;

          // Get public URL
          const { data: { publicUrl } } = await supabase.storage
            .from("just_need")
            .getPublicUrl(filePath);

          imageUrl = publicUrl;
        }

        // Update category in database
        const updateData = {
          categoryName: categoryName,
          ...(imageUrl && { image: imageUrl }) // Only include image if we have a URL
        };

        const { error: updateError } = await supabase
          .from("Categories")
          .update(updateData)
          .eq("id", editingCategoryId);

        if (updateError) throw updateError;

        toast.success("Category updated successfully!");
        await getCategoriesWithSubcategories();
        toggle();
      } else if (editingSubcategoryId) {
        // 🔵 Subcategory update (unchanged)
        const updatedData = { categoryName };
        const result = await updateSubcategoryName(editingSubcategoryId, updatedData);

        if (result) {
          toast.success("Subcategory updated successfully!");
          await getCategoriesWithSubcategories();
          toggle();
        } else {
          toast.error("Failed to update subcategory");
        }
      } else {
        toast.error("Missing ID for update");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(`An error occurred: ${error.message}`);
    }
  }, [
    categoryName,
    categoryImage,
    categoryImageUrl,
    editingCategoryId,
    editingSubcategoryId,
    updateSubcategoryName,
    getCategoriesWithSubcategories,
    toggle,
  ]);



  // const handleSaveEditPopup = useCallback(async () => {
  //   if (categoryName.trim() === "") {
  //     toast.error("Name cannot be empty.");
  //     return;
  //   }

  //   try {
  //     if (editingCategoryId) {
  //       // Update category name
  //       const nameSuccess = await updateCategoryName(editingCategoryId, categoryName);

  //       // Update category image if a new image is uploaded
  //       let imageSuccess = true;
  //       if (categoryImage) {
  //         const fileExt = categoryImage.name.split(".").pop();
  //         const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
  //         const filePath = `category-images/${fileName}`;

  //         // Upload image to Supabase storage
  //         const { data: imageData, error: imageError } = await supabase.storage
  //           .from("just_need") // Replace with your actual bucket name
  //           .upload(filePath, categoryImage, {
  //             cacheControl: "3600",
  //             upsert: false,
  //           });

  //         if (imageError) throw new Error("Image upload failed: " + imageError.message);

  //         const { data: publicUrlData } = supabase.storage
  //           .from("just_need")
  //           .getPublicUrl(filePath);

  //         if (!publicUrlData?.publicUrl) throw new Error("Failed to get public URL");

  //         // Update the category with the new image URL in the database
  //         const { error: updateError } = await supabase
  //           .from("Categories") // Replace with your actual table name
  //           .update({ image: publicUrlData.publicUrl })
  //           .eq("id", editingCategoryId);

  //         if (updateError) throw new Error("Failed to update category image: " + updateError.message);

  //         imageSuccess = true;
  //       }

  //       if (nameSuccess && imageSuccess) {
  //         toast.success("Category updated successfully!");
  //         await getCategoriesWithSubcategories();
  //         toggle();
  //       } else {
  //         toast.error("Failed to update category.");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error updating category:", error);
  //     toast.error(`An error occurred: ${error.message}`);
  //   }
  // }, [
  //   categoryName,
  //   categoryImage,
  //   editingCategoryId,
  //   updateCategoryName,
  //   getCategoriesWithSubcategories,
  //   toggle,
  // ]);

  const handleOverlayClick = useCallback(() => {
    setShowPopup(false);
    setSelectedItem(null);
  }, []);


  // Update the toggleDisableCard function
  const toggleDisableCard = useCallback(
    async (itemId, currentStatus, action, isCategory = false) => {
      if (action === "confirm") {
        setShowDisablePopup(false);
        setCurrentCardIndex(null);

        try {
          const newStatus = !currentStatus;

          if (isCategory) {
            await toggleCategoryStatus(itemId, newStatus);
            // Close edit form if it was open
            if (showForm) toggle();

            // Update active tab if needed
            if (!newStatus && activeTab === categories.findIndex(cat => cat.id === itemId)) {
              const newActiveTab = categories.findIndex(cat => cat.isActive && cat.id !== itemId);
              setActiveTab(newActiveTab >= 0 ? newActiveTab : 0);
            }
          } else {
            await toggleSubcategoryStatus(itemId, newStatus);
          }

          await getCategoriesWithSubcategories();

          toast.success(
            `${isCategory ? "Service" : "Subservice"} ${newStatus ? "unblocked" : "blocked"
            } successfully!`
          );
        } catch (error) {
          console.error("Error toggling status:", error);
          toast.error(
            `Failed to ${newStatus ? "unblock" : "block"}: ${error.message}`
          );
        }
      } else {
        setShowDisablePopup(false);
        setCurrentCardIndex(null);
      }
    },
    [toggleCategoryStatus, toggleSubcategoryStatus, getCategoriesWithSubcategories, showForm, toggle, activeTab, categories]
  );


  const handleCategoryClick = useCallback(
    (item) => {
      const sourceArray = searchQuery.trim()
        ? filteredCategoriesData
        : categories;

      const foundItem = sourceArray.find((cat) => cat.id === item.id);

      if (foundItem?.isActive) {
        const updatedArray = [
          foundItem,
          ...sourceArray.filter((cat) => cat.id !== item.id),
        ];

        const newIndex = sourceArray.findIndex((cat) => cat.id === item.id);

        setActiveTab(newIndex !== -1 ? newIndex : 0);
        setSelectedSubcategories(foundItem.subcategory || []);
        setSelectedCategoryId(foundItem.id);
        setActiveCategoryId(foundItem.id); // ✅ THIS is important for UI
        setIsVertical(false);

        localStorage.setItem("activeCategoryId", foundItem.id);
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
    setCategoryImageUrl(currentCategory?.image || "");
    setCategoryImage(null);
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






  const toggleOptionsVisibility = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  const blockedItems = useMemo(() => {
    const blockedCategories = categories
      .filter((cat) => cat.isActive === false)
      .map((cat) => ({
        id: cat.id,
        name: cat.categoryName,
        type: 'category',
        image: cat.image
      }));

    const blockedSubcategories = categories
      .flatMap((category) =>
        (category.subcategory || [])
          .filter((sub) => sub.isActive === false)
          .map((sub) => ({
            ...sub,
            type: 'subcategory',
            parentCategoryName: category.categoryName
          }))
      );

    return {
      categories: blockedCategories,
      subcategories: blockedSubcategories
    };
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
  // Update the handleUnblockBoth function
  const handleUnblockBoth = async (itemId, isCategory = false) => {

    try {
      if (isCategory) {
        await toggleCategoryStatus(itemId, true);
      } else {
        await toggleSubcategoryStatus(itemId, true);
      }

      await getCategoriesWithSubcategories();
      toast.success(
        `${isCategory ? "Service" : "Subservice"} unblocked successfully!`
      );

    } catch (error) {
      console.error("Error unblocking:", error);
      toast.error(`Failed to unblock: ${error.message}`);
    }
  };

  //   const handleUnblockBoth = async (itemId, isCategory = false) => {
  const [sortedData, setSortedData] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  useEffect(() => {
    const sorted = [...filteredCategoriesData].sort((a, b) => {
      const aCount = a.subcategory?.filter(sub => sub.isActive).length || 0;
      const bCount = b.subcategory?.filter(sub => sub.isActive).length || 0;
      return bCount - aCount;
    });

    setSortedData(sorted);

    // ✅ Get saved ID from localStorage
    const savedId = localStorage.getItem("activeCategoryId");

    if (savedId) {
      const newIndex = sorted.findIndex((item) => item.id === savedId);
      if (newIndex !== -1) {
        setActiveTab(newIndex);
        setActiveCategoryId(savedId); // ensure styling works
        setSelectedSubcategories(sorted[newIndex]?.subcategory || []);
        setSelectedCategoryId(savedId);
      } else {
        setActiveTab(0);
        setActiveCategoryId(sorted[0]?.id || null);
      }
    } else {
      setActiveTab(0);
      setActiveCategoryId(sorted[0]?.id || null);
    }
  }, [filteredCategoriesData]);



  return (
    <div className="p-[14px]  bg-white">
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
            <div className="flex items-center justify-between mt-[20px] xl:mt-[0px]">
              <div className="bg-[#F1F1F1] w-[337px] px-[16px] py-2.5 h-[42px] rounded-[10px]">
                <div className="flex items-center">
                  <Searchicon />
                  <input
                    className="text-[16px] font-normal outline-none ms-[10px] bg-transparent"
                    type="text"
                    placeholder="Search Services"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex">
                <div
                  onClick={handleNewServicePopUp}
                  className="whitespace-nowrap cursor-pointer bg-[#0832DE] flex items-center h-[42px] px-[16px] py-2.5 rounded-[10px] ms-[20px]"
                >
                  <Plusicon />
                  <p className="font-normal text-[16px] text-white ms-[12px]">
                    Add New Service
                  </p>
                </div>
                <div className="flex whitespace-nowrap cursor-pointer bg-[#0832DE] items-center h-[42px] px-[16px] py-2.5 rounded-[10px] ms-[20px]">


                  <div
                    className={``}
                  >
                    <button
                      className="text-[#ffffff] font-normal text-base"
                      onClick={toggleOptionsVisibility}
                    >
                      View Blocked List
                    </button>
                  </div>
                  <div
                    className={`cursor-pointer ps-1 flex flex-col justify-start view_block_icon`}
                    onClick={toggleLayout}
                  >
                    <UnderIcon />
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="flex h-[calc(100vh-215px)] mt-5">
            <div className="mt-6 relative w-[400px] overflow-auto pb-5">
              <div className={`flex w-full ${isVertical ? "border-b border-[rgb(128,128,128)]" : ""}`}>
                <div
                  className={`gap-4 flex flex-col w-full cursor-pointer scrollRemove  pe-4  ${isVertical ? "flex-wrap" : ""}`}
                >

                  {sortedData.map((items, index) => {

                    return (
                      <div
                        key={items.id}
                        className={`flex items-center p-2 rounded-xl justify-between ${!isVertical ? "border-2 " : ""}    hover:text-blue-500 hover:border-blue-500 ${activeCategoryId === items.id ? "border-blue-500 text-blue-500" : "border-transparent text-gray-700"} ${!items.isActive ? "opacity-50" : ""}`}
                        onClick={() => {
                          if (items.isActive) {
                            handleCategoryClick(items); // ✅ send full item
                          }
                        }}
                      >
                        <div className="flex gap-2">
                          <img
                            className="h-[30px] w-[30px] object-cover rounded-full"
                            src={items.image}
                            alt=""
                          />
                          <p className="font-normal text-base transition mx-[5px] mt-0.5">
                            {highlightText(items?.categoryName)}
                          </p>
                          <span className="font-normal text-xs flex justify-center items-center w-[25px] h-[17px] bg-[#0000000F] rounded-[60px] py-1 px-1.5 -ms-5">
                            {items?.subcategory?.filter(sub => sub.isActive).length || 0}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          {items.isActive && (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCategoryEdit(items.id, items.categoryName, e);
                              }}
                            >
                              <Editicon />
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>


              </div>
            </div>

            <div className="px-5 pb-10 flex flex-col items-center w-full overflow-auto  bg-[#f7f7f780]/50 rounded-xl">
              <div className="flex justify-between gap-[18px] mt-6 flex-wrap w-full ">
                {selectedSubcategories?.length > 0 &&
                  selectedSubcategories?.filter((sub) => sub?.isActive).map((sub, index) => {
                    // console.log(sub, "items")
                    return (
                      <div
                        key={index}
                        className="group w-full lg:w-[48%] xl:w-[48.5%] hover:bg-[#6C4DEF1A] bg-[#6b4def07] hover:border-[#6CDEF1A] border border-[#0000001A] lg:p-5 p-3 rounded-[10px] transition"
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

                              {highlightText(sub?.subCategoryName, searchQuery)}
                            </p>
                          )}

                          <div className="flex lg:gap-4 gap-2">
                            <div
                              className="cursor-pointer"
                              onClick={(e) => { handleSubcategoryEdit(sub.subCatId, sub.subCategoryName, e); setSubCat(sub) }}
                            >
                              <Editicon />
                            </div>

                          </div>
                        </div>
                      </div>
                    )
                  })}
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
            <>
              {console.log("✅ DisablePopUp is rendering", currentCardIndex)}

              <DisablePopUp

                onConfirm={() =>

                  toggleDisableCard(
                    currentCardIndex,
                    isCategoryToggle
                      ? categories.find((cat) => cat.id === currentCardIndex)?.isActive
                      : selectedSubcategories.find((sub) => sub.subCatId === currentCardIndex)?.isActive,
                    "confirm",
                    isCategoryToggle
                  )
                }
                onCancel={() => setShowDisablePopup(false)}
                isActive={
                  isCategoryToggle
                    ? categories.find((cat) => cat.id === currentCardIndex)?.isActive
                    : selectedSubcategories.find((sub) => sub.subCatId === currentCardIndex)?.isActive
                }
                
                confirmText={
                  isCategoryToggle &&
                    !categories.find((cat) => cat.id === currentCardIndex)?.isActive
                    ? "Yes Enable"
                    : "Yes Disable"
                }
              /></>
          )}

          <div className="flex justify-center items-center">

            {isVisible && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="w-[450px] bg-white shadow-lg rounded-lg flex flex-col"
                >
                  {/* Header */}
                  <div className="p-4 bg-[#EEEEEE] flex justify-between items-center rounded-t-lg">
                    <span className="font-normal text-base">Blocked Items</span>
                    <button
                      onClick={() => setIsVisible(false)}
                      className="focus:outline-none me-1"
                    >
                      <AiOutlineClose size={20} />
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-gray-300">
                    <button
                      onClick={() => setActiveServiceTab("services")}
                      className={`flex-1 py-2 text-center ${activeServiceTab === "services"
                        ? "border-b-2 border-[#3B60E4] text-[#3B60E4] font-medium"
                        : "text-gray-500"
                        }`}
                    >
                      Services ({blockedItems.categories.length})
                    </button>
                    <button
                      onClick={() => setActiveServiceTab("subservices")}
                      className={`flex-1 py-2 text-center ${activeServiceTab === "subservices"
                        ? "border-b-2 border-[#3B60E4] text-[#3B60E4] font-medium"
                        : "text-gray-500"
                        }`}
                    >
                      Sub Services ({blockedItems.subcategories.length})
                    </button>
                  </div>

                  {/* Content */}
                  <div className="py-2.5 px-5 h-[300px] overflow-y-scroll">
                    {activeServiceTab === "services" ? (
                      blockedItems.categories.length === 0 ? (
                        <p className="text-[#999999] font-normal text-base py-2">
                          No blocked services found.
                        </p>
                      ) : (
                          blockedItems.categories.map((item) => {
                          console.log(item, "adfsad")  
                          return (
                            <div
                              key={`cat-${item.id}`}
                              className="flex justify-between items-center py-2 border-b border-gray-100"
                            >
                              <div className="flex items-center">
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt=""
                                    className="w-8 h-8 rounded-full mr-3 object-cover"
                                  />
                                )}
                                <span className="text-[#333] font-normal text-base">
                                  {item.name || "Unnamed Service"}
                                </span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUnblockBoth(item.id, true); 
                                }}
                                className="text-green-600 hover:text-green-800 font-medium"
                              >
                                Unblock
                              </button>
                            </div>
                          )
                        })
                      )
                    ) : blockedItems.subcategories.length === 0 ? (
                      <p className="text-[#999999] font-normal text-base py-2">
                        No blocked sub services found.
                      </p>
                    ) : (
                      blockedItems.subcategories.map((item) => {
                        console.log(item, "adfsad")  
                        return (
                          <div
                            key={`sub-${item.subCatId}`}
                            className="flex justify-between items-center py-2 border-b border-gray-100"
                          >
                            <div>
                              <p className="text-[#333] text-base font-normal">
                                {item.subCategoryName || "Unnamed Sub Service"}
                              </p>
                              <p className="text-xs text-gray-500">
                                Parent: {item.parentCategoryName || "No parent service"}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUnblockBoth(item.subCatId, false); // false indicates this is a subcategory
                              }}
                              className="text-green-600 hover:text-green-800 font-medium"
                            >
                              Unblock
                            </button>
                          </div>
                        )
                      })
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
                  {/* Header */}
                  <div className="flex justify-center items-center border-b pb-6">
                    <h2 className="text-lg font-semibold">
                      {editingCategoryId ? "Edit Service" : "Edit Subservice"}
                    </h2>
                    <button
                      onClick={toggle}
                      className="text-gray-600 hover:text-black absolute right-6 top-4"
                    >
                      <AiOutlineClose size={20} />
                    </button>
                  </div>

                  {/* Name Field */}
                  <div className="mt-6">
                    <label className="block text-base font-normal text-[#000000]">
                      {editingCategoryId ? "Service Name" : "Subservice Name"}
                    </label>
                    <input
                      type="text"
                      value={categoryName}
                      onChange={handleCategoryInputChange}
                      className="w-full mt-[10px] p-2 border rounded text-[#000000] focus:outline-none"
                      placeholder={
                        editingCategoryId
                          ? "Enter Service name"
                          : "Enter subservice name"
                      }
                    />
                  </div>

                  {/* Image Upload (only for services) */}
                  {editingCategoryId && (
                    <>
                      <label
                        className="block text-base font-normal text-[#000000] mb-2.5 mt-[15px]"
                        htmlFor="fileUpload"
                      >
                        Service Image
                      </label>
                      <div className="flex items-center gap-2 bg-[#F2F2F2] rounded-lg p-2">
                        <input
                          type="text"
                          placeholder={categoryImageUrl ? "Image Uploaded" : "No Image Chosen"}
                          value={categoryImageUrl ? "Image Uploaded" : "No Image Chosen"}
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
                        <div className="mt-2 flex items-center gap-2">
                          <img
                            src={categoryImageUrl}
                            alt="Category Preview"
                            className="w-[100px] h-[100px] object-cover rounded-lg"
                          />
                          <button
                            onClick={() => {
                              setCategoryImage(null);
                              setCategoryImageUrl("");
                            }}
                            className="text-red-500 text-sm"
                          >
                            Remove Image
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {/* Save Button */}
                  <button
                    onClick={handleSaveEditPopup}
                    disabled={!categoryName.trim()}
                    className={`w-full font-normal text-base text-white mt-6 py-2 rounded-[10px] ${!categoryName.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-[#0832DE] hover:bg-[#0729bb]"
                      }`}
                  >
                    Save Details
                  </button>

                  {/* Block/Unblock Button */}
                  {(editingCategoryId || subCat) && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        const isCategory = !!editingCategoryId;
                        const itemId = isCategory ? editingCategoryId : subCat.subCatId;
                        const currentStatus = isCategory
                          ? categories.find(cat => cat.id === editingCategoryId)?.isActive
                          : subCat?.isActive;
                        setIsVisible(false);
                        setShowForm(false);
                        // Show confirmation popup
                        setCurrentCardIndex(itemId);
                        setIsCategoryToggle(isCategory);
                        setShowDisablePopup(true);
                      }}
                      className={`w-full font-normal text-base mt-4 py-2 rounded-[10px] flex justify-center items-center gap-2 transition-colors ${(editingCategoryId
                        ? categories.find(cat => cat.id === editingCategoryId)?.isActive
                        : subCat?.isActive)
                        ? "bg-[#e70000] text-white hover:bg-[#c50000]"
                        : "bg-green-500 text-white hover:bg-green-600"
                        }`}
                    >
                      {(editingCategoryId
                        ? categories.find(cat => cat.id === editingCategoryId)?.isActive
                        : subCat?.isActive) ? (
                        <>
                          <DisableRedicon />
                          Block {editingCategoryId ? "Service" : "Subservice"}
                        </>
                      ) : (
                        <>
                          <EnableRedIcon />
                          Unblock {editingCategoryId ? "Service" : "Subservice"}
                        </>
                      )}
                    </button>
                  )}
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