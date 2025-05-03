/* eslint-disable react-hooks/exhaustive-deps */


/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import { ActionIcon, SearchIcon } from '../../assets/icon/Icon';
import { FilterIcon, CloseIcon, DeleteIcon, DownArrow, ArrowIconLeft, ArrowIconRigth, SpikendCirclChat, SpikStartCirclChat } from '../../assets/icon/Icons';
import Filters from '../../Components/Popups/Filters';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '../../store/supabaseCreateClient';
import { useComplaintProvider } from '../../store/RaiseComplaintData';

export const Complaints = () => {
  const location = useLocation();
  const [val, setVal] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef(null);
  const [activeFilters, setActiveFilters] = useState({
    duration: '',
    serviceType: [],
    complaintStatus: [],
  });
  const [allChecked, setAllChecked] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [showItemsDropdown, setShowItemsDropdown] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [complaintData, setComplaintData] = useState([]);



  const { complaints } = useComplaintProvider()

  useEffect(() => {
    setComplaintData(complaints)
  })



  // Pagination calculations using complaintData
  const totalItems = complaintData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = complaintData.slice(startIndex, endIndex);

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const showButtons = checkedCount >= 2;

  // Checkbox handlers
  const handleMainCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setAllChecked(isChecked);
    const newCheckedItems = {};
    currentItems.forEach(item => {
      newCheckedItems[item.id] = isChecked;
    });
    setCheckedItems(newCheckedItems);
  };

  const handleItemCheckboxChange = (id) => (e) => {
    const newCheckedItems = {
      ...checkedItems,
      [id]: e.target.checked
    };
    setCheckedItems(newCheckedItems);
    const allItemsChecked = currentItems.every(item => newCheckedItems[item.id]);
    setAllChecked(allItemsChecked);
  };

  // Filter handlers
  const handleFilterToggle = () => setShowFilter(!showFilter);

  const handleActiveFilterChange = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const removeFilter = (filterType, filter) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: Array.isArray(prev[filterType])
        ? prev[filterType].filter(item => item !== filter)
        : ''
    }));
  };

  // Pagination handlers
  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
    setShowItemsDropdown(false);
    setCheckedItems({});
    setAllChecked(false);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      setCheckedItems({});
      setAllChecked(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      setCheckedItems({});
      setAllChecked(false);
    }
  };

  // Click outside filter handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  console.log(currentItems,"currentItems")

  return (
    <div className="p-5 bg-white rounded-[10px]">
      {location.pathname === `/dashboard/complaints/complaintsDetails/${val}` ? (
        <Outlet />
      ) : (
        <div className="mt-3">
          {/* Header Section */}
          <div className="lg:flex justify-between items-center px-4 py-2">
            <div className='flex gap-3 items-center'>
              <h1 className='font-medium text-xl'>All Complaints</h1>
              {showButtons && (
                <>
                  <button className="border border-[#F1F1F1] ms-6 text-[#00000099] py-[7px] px-[20px] rounded-[10px] flex items-center gap-2">
                    <DeleteIcon /> Delete
                  </button>
                  <button className="border border-[#F1F1F1] text-[#00000099] py-[7px] px-[20px] rounded-[10px] flex items-center gap-2">
                    My Action <DownArrow />
                  </button>
                </>
              )}
            </div>

            {/* Active Filters */}
            <div className="flex items-center gap-4 flex-wrap">
              {Object.entries(activeFilters).map(([filterType, filters]) =>
                Array.isArray(filters) ? (
                  filters.map((filter, index) => (
                    <div key={`${filterType}-${index}`} className="flex items-center px-[10px] py-2 rounded-[10px] bg-[#F1F1F1] space-x-2">
                      <span>{filter}</span>
                      <button onClick={() => removeFilter(filterType, filter)}><CloseIcon /></button>
                    </div>
                  ))
                ) : (
                  filters && (
                    <div key={filterType} className="flex items-center px-[10px] py-2 rounded-[10px] bg-[#F1F1F1] space-x-2">
                      <span>{filters}</span>
                      <button onClick={() => removeFilter(filterType, filters)}><CloseIcon /></button>
                    </div>
                  )
                )
              )}
            </div>

            {/* Search and Filter */}
            <div className="flex items-center gap-4 mt-4 lg:mt-0">
              <div className="flex items-center h-[44px] px-4 bg-gray-200 rounded-lg w-[51vh] lg:w-[250px]">
                <SearchIcon />
                <input type="text" placeholder="Search complaints" className="w-full outline-none bg-transparent ml-2" />
              </div>
              <div className="relative" ref={filterRef}>
                <button onClick={handleFilterToggle} className="bg-[#0832DE] flex items-center text-white px-4 h-[44px] rounded-lg ml-4">
                  <FilterIcon /> <span className="md:ms-3 ms-2">{showFilter ? 'Hide' : 'Filter'}</span>
                </button>
                {showFilter && (
                  <div className="absolute right-0 mt-2 z-10">
                    <Filters activeFilters={activeFilters} onFilterChange={handleActiveFilterChange} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Complaints Table */}
          <div className="overflow-x-auto mt-6">
            <table className="w-full text-left border-separate border-spacing-y-2 whitespace-nowrap rounded-xl">
              <thead>
                <tr>
                  <th className="text-black text-sm font-medium py-3 px-4 border-b">
                    <input type="checkbox" checked={allChecked} onChange={handleMainCheckboxChange} />
                  </th>
                  <th className="text-black text-sm font-medium py-3 px-4 border-b">Complaint ID</th>
                  <th className="text-black text-sm font-medium py-3 px-4 border-b">Related To</th>
                  <th className="text-black text-sm font-medium py-3 px-4 border-b">Title</th>
                  <th className="text-black text-sm font-medium py-3 px-4 border-b">Description</th>
                  <th className="text-black text-sm font-medium py-3 px-4 border-b">Date</th>
                  <th className="text-black text-sm font-medium py-3 px-4 border-b">Email</th>
                  <th className="text-black text-sm font-medium py-3 px-4 border-b">Status</th>
                  <th className="text-black text-sm font-medium py-3 px-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (

                  <tr key={item.id} className="align-top">
                    <td className="text-black text-sm font-normal py-[4px] px-4">
                      <input
                        type="checkbox"
                        checked={checkedItems[item.complaintId] || false}
                        onChange={handleItemCheckboxChange(item.complaintId)}
                      />
                    </td>
                    <td className="text-[#6C4DEF] ext-sm font-normal px-4">
                      {/* <Link to={`/dashboard/complaints/complaintsDetails/${item.id}`}  onClick={() => setVal(item.id)}>
                        {item.id}
                      </Link> */}
                      <Link
                        to={`/dashboard/complaints/complaintsDetails/${item.complaintId}`}
                        state={{ complaint: item }} // Pass the entire complaint object as state
                        onClick={() => setVal(item.complaintId)}
                      >
                        {item.complaintId}
                      </Link>

                    </td>
                    <td className="text-black text-sm font-normal px-4">{item.complaintType}</td>
                    <td className="text-black text-sm font-normal px-4">{item.subject}</td>
                    <td className="text-black text-sm font-normal px-4 max-w-[279px] overflow-hidden whitespace-pre-wrap">
                      <div className="w-[279px] max-h-[60px] overflow-hidden whitespace-pre-wrap">
                        {item.description}
                      </div>
                    </td>
                    <td className="text-black text-sm font-normal px-4">
                      {new Date(item.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}{' '}
                      |{' '}
                      {new Date(item.created_at).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </td>
                    <td className=" text-black text-sm font-normal px-4">{item.userdetails?.useremail}</td>
                    <td className="text-center">
                      <span className={`px-2.5 py-[4px] rounded-full ${item.userdetails?.verificationStatus === 'Pending'
                        ? 'bg-[#FFA50029] text-[#FFA500]'
                        : 'bg-[#0080001A] text-[#008000]'
                        }`}>
                        {item.userdetails?.verificationStatus}
                      </span>
                    </td>
                    <td className="text-black text-sm font-normal px-4 text_center"><ActionIcon /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 bg-white rounded-[10px]">
            <div className="flex justify-end items-center">
              <div className="flex items-center me-6">
                <span className="me-3">Items per page:</span>
                <div className="relative">
                  <button
                    onClick={() => setShowItemsDropdown(!showItemsDropdown)}
                    className="border py-1 w-[70px] rounded-[10px] flex justify-center items-center"
                  >
                    {itemsPerPage} <span className="ml-1">▼</span>
                  </button>
                  {showItemsDropdown && (
                    <div className="absolute top-full mt-1 bg-white border rounded shadow-lg w-full z-10">
                      {[5, 10, 15, 20].map((item) => (
                        <button
                          key={item}
                          onClick={() => handleItemsPerPageChange(item)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <span className="me-3">
                  {startIndex + 1} - {endIndex} of {totalItems}
                </span>
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`p-2 ${currentPage === 1 ? 'opacity-50' : ''}`}
                >
                  <ArrowIconLeft />
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 ${currentPage === totalPages ? 'opacity-50' : ''}`}
                >
                  <ArrowIconRigth />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* done */}
    </div>
  );
};