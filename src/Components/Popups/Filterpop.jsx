/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { DownIcon, UpIcon } from '../../assets/icon/Icon';
import PriceRange from './PriceRange';
import { useServiceContext } from '../../store/ServiceContext';

const FilterComponent = ({ onClose, onApplyFilters ,preSelectedCategories = [], preSelectedSubCategories = [], preSelectedFilters = {}, onFilterChange }) => {
    const { categories } = useServiceContext();
    const [selectedPriceFilters, setSelectedPriceFilters] = useState({
        priceRange: [100, 800], 
    });
    const [openDropdown, setOpenDropdown] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]); 
    const [selectedSubCategories, setSelectedSubCategories] = useState([]); 
    const [selectedFilters, setSelectedFilters] = useState({ 
        status: null,
        priceRange: null,
        ratings: null
    });



    useEffect(() => {
        setSelectedCategories([...preSelectedCategories]);
        setSelectedSubCategories([...preSelectedSubCategories]);
        setSelectedFilters({
            status: preSelectedFilters.status || null,
            priceRange: preSelectedFilters.priceRange || null,
            ratings: preSelectedFilters.ratings || null,
        });
    }, [preSelectedCategories, preSelectedSubCategories, preSelectedFilters]);

    const handleCategorySelect = (category) => {
        const updatedCategories = selectedCategories.includes(category)
            ? selectedCategories.filter((c) => c !== category)
            : [...selectedCategories, category];
        setSelectedCategories(updatedCategories);
        onFilterChange("categories", updatedCategories);
    };

    const handleSubCategorySelect = (subCategory) => {
        const updatedSubCategories = selectedSubCategories.includes(subCategory)
            ? selectedSubCategories.filter((sc) => sc !== subCategory)
            : [...selectedSubCategories, subCategory];
        setSelectedSubCategories(updatedSubCategories);
        onFilterChange("subCategories", updatedSubCategories);
    };

    const handleFilterSelect = (filterType, value) => {
        setSelectedFilters((prevFilters) => ({ ...prevFilters, [filterType]: value }));
        onFilterChange(filterType, value);
    };



    const filterOptions = {
        status: ['Active', 'Blocked'],
        ratings: ['5+ Rating', '4+ Rating', '3+ Rating', '2+ Rating', '1+ Rating']
    };

    const toggleDropdown = (dropdownName) => {
        setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setSelectedSubCategories([]);
        setSelectedFilters({
            status: null,
            priceRange: null,
            ratings: null
        });
    };
    const handleApplyFilters = () => {
        const filters = {
            categories: selectedCategories,
            subCategories: selectedSubCategories,
            status: selectedFilters.status,
            priceRange: selectedFilters.priceRange,
            ratings: selectedFilters.ratings
        };

        console.log(filters, "filters")
        onApplyFilters(filters);  
        onClose(); 
    };

    console.log(selectedFilters.priceRange, "selectedFilters")
    return (
        <div className="p-[18px] bg-white rounded-lg">
            <div className='flex flex-col justify-between  overflow-y-scroll h-[390px] scrollRemove'>
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
                        <button
                            onClick={clearFilters}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            Clear All
                        </button>
                    </div>

                    {/* Category Filter */}
                    <div className="mb-4">
                        <button
                            onClick={() => toggleDropdown('category')}
                            className="w-full flex justify-between items-center p-3 border-b rounded-none"
                        >
                            <span className="font-normal text-base">Category</span>
                            {openDropdown === 'category' ? (
                                <p className="h-5 w-5 text-gray-500"><DownIcon /></p>
                            ) : (
                                <p className="h-5 w-5 text-gray-500"><UpIcon /></p>
                            )}
                        </button>
                        {openDropdown === 'category' && (
                            <div className="mt-2 p-3 grid grid-cols-2 rounded-lg">
                                {categories.map((item) => (
                                    <div key={item.id} className="flex items-center mb-2 last:mb-0">
                                        <span>  <input
                                            type="checkbox"
                                            id={`category-${item.id}`}
                                            checked={selectedCategories.includes(item.categoryName)}
                                            onChange={() => handleCategorySelect(item.categoryName)}
                                            className="h-4 w-4 text-blue-600 rounded flex"
                                        /></span>
                                        <label
                                            htmlFor={`category-${item.id}`}
                                            className="ml-2 text-[#00000099] font-normal text-base whitespace-wrap"
                                        >
                                            {item.categoryName}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sub-category Filter */}
                    {selectedCategories.length > 0 && (
                        <div className="mb-4">
                            <button
                                onClick={() => toggleDropdown('subCategory')}
                                className="w-full flex justify-between items-center p-3 border-b rounded-none"
                            >
                                <span className="font-normal text-base">Sub-category</span>
                                {openDropdown === 'subCategory' ? (
                                    <p className="h-5 w-5 text-gray-500"><DownIcon /></p>
                                ) : (
                                    <p className="h-5 w-5 text-gray-500"><UpIcon /></p>
                                )}
                            </button>
                            {openDropdown === 'subCategory' && (
                                <div className="mt-2 p-3 rounded-lg">
                                    {selectedCategories.map((categoryName) => {
                                        const category = categories.find(cat => cat.categoryName === categoryName);
                                        return (
                                            <div key={category.id} className="mb-3">
                                                <h4 className="font-medium text-gray-600 mb-2">{category.categoryName}</h4>
                                                {category?.subcategory?.map((subItem) => (
                                                    <div key={subItem.id} className="flex items-center mb-2 ml-2">
                                                        <input
                                                            type="checkbox"
                                                            id={`subCategory-${subItem.id}`}
                                                            checked={selectedSubCategories.includes(subItem.categoryName)}
                                                            onChange={() => handleSubCategorySelect(subItem.categoryName)}
                                                            className="h-4 w-4 text-blue-600 rounded"
                                                        />
                                                        <label
                                                            htmlFor={`subCategory-${subItem.id}`}
                                                            className="ml-2 text-[#00000099] font-normal text-base"
                                                        >
                                                            {subItem.categoryName}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Status Filter */}
                    <div className="mb-4">
                        <button
                            onClick={() => toggleDropdown('status')}
                            className="w-full flex justify-between items-center p-3 border-b rounded-none"
                        >
                            <span className="font-normal text-base">Status</span>
                            {openDropdown === 'status' ? (
                                <p className="h-5 w-5 text-gray-500"><DownIcon /></p>
                            ) : (
                                <p className="h-5 w-5 text-gray-500"><UpIcon /></p>
                            )}
                        </button>
                        {openDropdown === 'status' && (
                            <div className="mt-2 p-3 rounded-lg">
                                {filterOptions.status.map((item) => (
                                    <div key={item} className="flex items-center mb-2 last:mb-0">
                                        <input
                                            type="radio"
                                            id={`status-${item}`}
                                            name="status"
                                            checked={selectedFilters.status === item}
                                            onChange={() => handleFilterSelect('status', item)}
                                            className="h-4 w-4 text-blue-600"
                                        />
                                        <label htmlFor={`status-${item}`} className="ml-2 text-[#00000099] font-normal text-base">
                                            {item}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Price Range Filter */}
                    <div className="mb-4">
                        <button
                            onClick={() => toggleDropdown('priceRange')}
                            className="w-full flex justify-between items-center p-3 border-b rounded-none"
                        >
                            <span className="font-normal text-base">Price Range</span>
                            {openDropdown === 'priceRange' ? (
                                <p className="h-5 w-5 text-gray-500"><DownIcon /></p>
                            ) : (
                                <p className="h-5 w-5 text-gray-500"><UpIcon /></p>
                            )}
                        </button>
                        {openDropdown === 'priceRange' && <PriceRange initialPriceRange={selectedFilters} onPriceChange={handleFilterSelect} />}
                    </div>

                    {/* Ratings Filter */}
                    <div className="mb-6">
                        <button
                            onClick={() => toggleDropdown('ratings')}
                            className="w-full flex justify-between items-center p-3 border-b rounded-none"
                        >
                            <span className="font-normal text-base">Ratings</span>
                            {openDropdown === 'ratings' ? (
                                <p className="h-5 w-5 text-gray-500"><DownIcon /></p>
                            ) : (
                                <p className="h-5 w-5 text-gray-500"><UpIcon /></p>
                            )}
                        </button>
                        {openDropdown === 'ratings' && (
                            <div className="mt-2 p-3 rounded-lg">
                                {filterOptions.ratings.map((item) => (
                                    <div key={item} className="flex items-center mb-2 last:mb-0">
                                        <input
                                            type="radio"
                                            id={`ratings-${item}`}
                                            name="ratings"
                                            checked={selectedFilters.ratings === item}
                                            onChange={() => handleFilterSelect('ratings', item)}
                                            className="h-4 w-4 text-blue-600"
                                        />
                                        <label htmlFor={`ratings-${item}`} className="ml-2 text-[#00000099] font-normal text-base">
                                            {item}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <div className="flex gap-4 mt-[30px]">
                        <button onClick={handleApplyFilters} className="w-full py-2 px-4 bg-[#0832DE] text-white rounded-[10px] transition-colors">
                            Apply
                        </button>
                        <button onClick={onClose} className="w-full py-2 px-4 bg-[#F1F1F1] text-black rounded-[10px]">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterComponent;