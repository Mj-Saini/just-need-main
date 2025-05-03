/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";

import disable_img from "../../assets/png/disable_img.png";
import enable_img from "../../assets/png/enable_img.png";
import { DownArrow, FilterSvg, RatingStarIcon } from "../../assets/icon/Icons";
import { Link } from "react-router-dom";
import { useListingContext } from "../../store/ListingContext";
import { supabase } from "../../store/supabaseCreateClient";
import { truncateText } from "../../utility/wordTruncate";
import { CiFilter, CiSearch } from "react-icons/ci";
import FiltersPopup from "../../Components/Popups/Filterpop";
import FilterComponent from "../../Components/Popups/Filterpop";


const Listing = () => {
  const { fetchlisting } = useListingContext();
  const [listData, setListData] = useState([]);
  const [isFilterPopup, setIsfilterPopup] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchPlaceholder, setSearchPlaceholder] = useState("Search Name");
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);
  
  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const visibleData = filteredData.slice(0, visibleCount);
  async function getData() {
    const value = await fetchlisting();

    setListData([...value]);
  }
  //handle block
  async function handleBlock(e, id, val) {
    e.preventDefault();
    const confirmDelete = window.confirm("Are you sure to Block User ?");
    if (confirmDelete) {
      const { data, error } = await supabase
        .from("service_listings") // Replace with your table name
        .update({
          blockStatus: {
            isBlocked: !val.isBlocked,
            reason: val.reason,
            blockedBy: val.blockedBy,
          },
        }) // Pass the updated data object
        .eq("id", id); // Filter by id

      if (!error) {
        setListData((prevState) =>
          prevState.map((item) =>
            item.id == id
              ? {
                ...item,
                blockStatus: {
                  ...item.blockStatus,
                  isBlocked: !item.blockStatus.isBlocked,
                },
              }
              : item
          )
        );
      } else {
        alert("something went wrong. Please try again");
      }
    }
  }



  useEffect(() => {
    getData();
  }, []);


  // 🔎 **Search Logic**
  useEffect(() => {
    let tempData = [...listData];

    // Apply search filter
    if (searchTerm.trim() !== "") {
      tempData = tempData.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply additional filters
    if (appliedFilters) {
      if (appliedFilters.categories.length > 0) {
        tempData = tempData.filter((item) =>
          appliedFilters.categories.includes(item.categoryName)
        );
      }
      if (appliedFilters.subCategories.length > 0) {
        tempData = tempData.filter((item) =>
          appliedFilters.subCategories.includes(item.subCategoryName)
        );
      }
      if (appliedFilters.status) {
        tempData = tempData.filter((item) =>
          item.blockStatus.isBlocked === (appliedFilters.status === "Blocked")
        );
      }
      if (appliedFilters.ratings) {
        const ratingValue = parseInt(appliedFilters.ratings[0], 10);
        tempData = tempData.filter((item) => item.rating >= ratingValue);
      }
    }

    setFilteredData(tempData);
  }, [searchTerm, listData, appliedFilters]);

  const applyFilters = (filters) => {
    setAppliedFilters(filters);
  };

  const removeFilter = (filterType, value) => {
    setAppliedFilters((prevFilters) => {
      // Clone the appliedFilters to avoid mutating the state directly
      const updatedFilters = { ...prevFilters };

      // Check the type of filter and remove the appropriate filter
      if (filterType === "categories") {
        updatedFilters.categories = updatedFilters.categories.filter(
          (category) => category !== value
        );
      } else if (filterType === "subCategories") {
        updatedFilters.subCategories = updatedFilters.subCategories.filter(
          (subCategory) => subCategory !== value
        );
      } else if (filterType === "ratings") {
        updatedFilters.ratings = null; // Remove the rating filter
      } else if (filterType === "priceRange") {
        updatedFilters.priceRange = null; // Remove the price range filter
      } else if (filterType === "status") {
        updatedFilters.status = null; // Remove the status filter
      }

      // Return the updated filter state
      return updatedFilters;
    });
  };


  if (listData.length !== 0) {
    return (
      <div     className="bg-[rgba(255, 255, 255, 1)] rounded-md p-5"
          style={{ background: "white" }}>
        <div
          className="bg-[rgba(255, 255, 255, 1)] rounded-md p-5"
          style={{ background: "white" }}
        >
          <div className="flex justify-between items-center mb-[17px]">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="font-medium text-[20px] text-[#000000] opacity-[70%]">
                  posted listing
                </h1>
              </div>
              <button className="border border-[#F1F1F1] text-[#00000099] py-[7px] px-[20px] rounded-[10px] flex items-center gap-2">
                My Action
                <span>
                  <DownArrow />
                </span>
              </button>
            </div>

            <div className="flex">
              <div className="flex rounded-[10px] items-center p-2 h-[42px] bg-[#F1F1F1] xl:me-[20px]">
                <CiSearch className="ms-2" />
                <input
                  placeholder={searchPlaceholder}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ms-2.5 focus:outline-none focus:ring-gray-400 bg-[#F1F1F1]"
                />
              </div>
              {/* <button onClick={() => setIsfilterPopup(!isFilterPopup)} className="mx-5 w-[40px] h-[40px] bg-[#F1F1F1] flex items-center justify-center rounded-[10px]">
                <FilterSvg />
              </button>  */}

              <button
                onClick={() => setIsfilterPopup(!isFilterPopup)}
                className="bg-[#0832DE] text-white px-[15px] py-2 ms-5 rounded-[10px] flex items-center"
              >
                <span>
                  <CiFilter className="w-[24px] h-[24px] me-[12px]" />
                </span>
                Filter
              </button>
            </div>
          </div>
          {/* Applied Filters Display */}
          <div className="flex gap-2 items-center">
            {appliedFilters?.categories.map((filters, index) => {
            return (
              <div key={index} className="flex items-center px-2 py-1 border rounded-full gap-2">
                <span className="">{filters}</span>
                <span onClick={() => removeFilter("categories", filters)} className="text-2xl text-[#333] cursor-pointer">&times;</span>
             </div>
            )
          })}
            {appliedFilters?.subCategories.map((filters, index) => {
            return (
              <div key={index} className="flex items-center px-2 py-1 border rounded-full gap-2">
                <span className="">{filters}</span>
                <span onClick={() => removeFilter("subCategories", filters)} className="text-2xl text-[#333] cursor-pointer">&times;</span>
             </div>
            )
          })}
         
         
            {appliedFilters?.ratings && (
              <div className="flex items-center px-2 py-1 border rounded-full gap-2">
                <span>{appliedFilters?.ratings}</span>
                <span onClick={() => removeFilter("ratings")} className="text-2xl text-[#333] cursor-pointer">&times;</span>
              </div>
            )}

            {appliedFilters?.priceRange && (
              <div className="flex items-center px-2 py-1 border rounded-full gap-2">
                <span>{appliedFilters?.priceRange}</span>
                <span onClick={() => removeFilter("priceRange")} className="text-2xl text-[#333] cursor-pointer">&times;</span>
              </div>
            )}

            {appliedFilters?.status && (
              <div className="flex items-center px-2 py-1 border rounded-full gap-2">
                <span>{appliedFilters?.status}</span>
                <span onClick={() => removeFilter("status")} className="text-2xl text-[#333] cursor-pointer">&times;</span>
              </div>
            )}

          
       
          </div>
          

          <div className="flex flex-row flex-wrap -mx-3">
            {visibleData.length > 0 ? (visibleData?.map((item) => (
              <Link
                to={`${item.id}`}
                style={{ filter: "drop-shadow(0,0,34 rgba(0,0,0,0.11))" }}
                className="w-6/12 mt-3 xl:mt-[15px] xl:w-3/12 px-3 filter !drop-shadow-lg"
                key={item.id}
              >
                <div className="h-full">
                  <div className="h-full  relative group flex flex-col">
                    <div className="relative">
                      <img
                        className="w-full group-hover:opacity-70 h-[128px] object-cover"
                        src={item.images[0]}
                        alt="Listing"
                      />
                      <button className="absolute bg-[#6C4DEF] z-20 text-white py-[2px] px-2 rounded-tr-[20px] rounded-br-[20px] bottom-[10px] transition-opacity duration-300 text-xs">
                        {item?.categoryName}
                      </button>
                    </div>

                    <div className="p-2.5 bg-white flex-grow">
                      <div className="flex  justify-between items-center">
                        <p className="font-normal text-base text-black">
                          {item.title}
                        </p>
                        <p className="font-normal text-[12px] text-[rgba(0, 0, 0, 0.6)]">
                          Feb 12
                        </p>
                      </div>

                      <div className="flex justify-between mt-[5px]">
                        <div>
                          <p className="font-semibold text-[18px]">
                            ₹ {item.price}
                          </p>
                        </div>
                        <div className="group-hover:hidden transition-opacity duration-300">
                          <button className="py-1">
                            {item.blockStatus.isBlocked ? (
                              <img src={disable_img} alt="disable_img" />
                            ) : (
                              <span className="text-xs font-normal text-[#0DA800] hover:opacity-100 opacity-100">
                                <img src={enable_img} alt="enable_img" />
                              </span>
                            )}
                          </button>
                        </div>
                        <div className="hidden py-[3px] group-hover:block  transition-opacity duration-300">
                          <button
                            onClick={(e) =>
                              handleBlock(e, item.id, item.blockStatus)
                            }
                          >
                            {item.blockStatus.isBlocked ? (
                              <span className="text-sm font-normal text-[#0DA800] hover:opacity-100 opacity-100">
                                <p>Enable</p>
                              </span>
                            ) : (
                              <span className="text-sm font-normal text-[#a81400] hover:opacity-100 opacity-100">
                                <p>Disable</p>
                              </span>
                            )}
                          </button>
                        </div>
                      </div>

                      <p className="font-normal text-[14px] text-[#00000099] mt-1">
                        {truncateText(item.description, 100)}
                      </p>
                      <div className="flex items-center justify-between gap-1 mt-2">
                        <div>
                          <p className="font-normal text-[#00000099] text-[12px]">
                            Hisar, Haryana
                          </p>
                        </div>
                        <div className="flex gap-3 items-center bg-[#FFA5001A] rounded-[50px] py-[2px] px-[5px]">
                          <RatingStarIcon />
                          <h3 className="text-[#000F02] text-[10px] font-normal">
                            {item.rating}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
            ) : (
              <p className="text-center text-gray-500 text-lg mt-5 w-full">No Data Found</p>
            )}
        
          </div>
        </div>
        {isFilterPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-hidden z-50">
            <div onClick={() => setIsfilterPopup(false)} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"></div>
            <div className="bg-white w-[425px] relative  z-[60]">
              <FilterComponent onApplyFilters={applyFilters} onClose={() => setIsfilterPopup(false)} preSelectedCategories={appliedFilters?.categories || []}
                preSelectedSubCategories={appliedFilters?.subCategories || []}
                preSelectedFilters={appliedFilters || {}} />
            </div>
          </div>
        )}
            {visibleCount <= visibleData.length && (
        <div className="text-center mt-4">
          <button
            onClick={handleShowMore}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Show More
          </button>
        </div>
      )}
      </div>
      
    );
    
  } else {
    return <div>No data found</div>;
  }
};

export default Listing;
