'use client';
import { useState, useEffect } from 'react';
import { CiSearch, CiFilter } from 'react-icons/ci';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '../../store/supabaseCreateClient';

const Rider = () => {
    const location = useLocation();
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [selectedFilters] = useState(["name"]);
  const [searchPlaceholder] = useState("Search by name, email, or ID");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${day} ${month} ${year} | ${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  // Fetch Riders data from Supabase with user details
  useEffect(() => {
    const fetchRiders = async () => {
      setLoading(true);
      let { data: RiderDetailsView, error } = await supabase
        .from('RiderDetailsView')
        .select(`
          *,
          user_detail:Users!RiderDetailsView_userId_fkey(
            firstName,
            lastName,
            useremail,
            mobile_number
          )
        `);

      if (error) {
        console.error(error);
      } else {
        setRiders(RiderDetailsView || []);
      }
      setLoading(false);
    };

    fetchRiders();
  }, []);

  // Filter logic based on selected fields
  const filteredRiders = riders?.filter((rider) => {
    if (selectedFilters.length === 0) {
      const riderName = `${rider.user_detail?.firstName || ''} ${rider.user_detail?.lastName || ''}`.toLowerCase();
      const riderEmail = rider.user_detail?.useremail?.toLowerCase() || '';
      return riderName.includes(searchTerm.toLowerCase()) || 
             riderEmail.includes(searchTerm.toLowerCase()) ||
             rider.userId?.toLowerCase().includes(searchTerm.toLowerCase());
    }

    return selectedFilters.some((filter) => {
      const riderName = `${rider.user_detail?.firstName || ''} ${rider.user_detail?.lastName || ''}`.toLowerCase();
      
      switch (filter) {
        case "userId":
          return rider.userId?.toLowerCase().includes(searchTerm.toLowerCase());
        case "name":
          return riderName.includes(searchTerm.toLowerCase());
        case "email":
          return rider.user_detail?.useremail?.toLowerCase().includes(searchTerm.toLowerCase());
        case "vehicleType":
          return rider.vehicleType?.toLowerCase().includes(searchTerm.toLowerCase());
        case "vehicleRegistrationNumber":
          return rider.vehicleRegistrationNumber?.toLowerCase().includes(searchTerm.toLowerCase());
        case "drivingLicenseNumber":
          return rider.drivingLicenseNumber?.toLowerCase().includes(searchTerm.toLowerCase());
        default:
          return false;
      }
    });
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredRiders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredRiders.length);
  const paginatedData = filteredRiders.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  function handleFilter() {
    setShowFilterPopup(!showFilterPopup);
  }

  console.log(riders, "riders");

    return (
        <>
            {location.pathname === "/dashboard/rider" &&
                <div className="bg-[#FFFFFF] p-5 rounded-[10px]">
                    <div className="flex justify-between items-center mt-[15px]">
                        <div className="flex items-center gap-6">
                            <button
                                className="text-base xl:text-[20px] font-medium text-[#fff] py-2 px-4 rounded-[10px] bg-[#0832DE]"
                            >
                                Riders List
                            </button>
                        </div>

                        <div className="flex gap-5">
                            <div className="flex rounded-[10px] items-center p-2 h-[42px] bg-[#F1F1F1] xl:me-[20px]">
                                <CiSearch className="ms-2" />
                                <input
                                    type="text"
                                    placeholder={searchPlaceholder}
                                    className="ms-2.5 focus:outline-none focus:ring-gray-400 bg-[#F1F1F1]"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <button
                                className="bg-[#0832DE] text-white px-[15px] py-2 rounded-[10px] flex items-center"
                                onClick={handleFilter}
                            >
                                <span>
                                    <CiFilter className="w-[24px] h-[24px] me-[12px]" />
                                </span>
                                Filter
                            </button>
                        </div>
                    </div>

  
                    <div className="overflow-x-auto mt-5">
                        <table className="w-full text-left border-separate border-spacing-4 whitespace-nowrap rounded-[10px]">
                            <thead>
                                <tr className="py-[8px]">
                                    <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
                                        S.No
                                    </th>
                                    <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
                                        Rider Name
                                    </th>
                                    <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
                                        Email
                                    </th>
                                    <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
                                        Vehicle Type
                                    </th>
                                    <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base w-[150px]">
                                        Vehicle Number
                                    </th>
                                    <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base w-[250px]">
                                        License Number
                                    </th>
                                    <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base w-[100px]">
                                        Experience
                                    </th>
                                    <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base w-[200px]">
                                        Created At
                                    </th>
                                    <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
                                        Offer Parcel
                                    </th>
                                    <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
                                        Status
                                    </th>
               
                                </tr>
                                <tr>
                                    <td colSpan="10">
                                        <div className="w-full border border-dashed border-[#00000066]"></div>
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="10" className="text-center py-4">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : paginatedData.length === 0 ? (
                                    <tr>
                                        <td colSpan="10" className="text-center py-4">
                                            No riders found
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedData?.map((rider, index) => {
                                        return (
                                            <tr key={rider.id}>
                                                <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
                                                    {index + 1}
                                                </td>
                                                <td className="px-[19px] md:px-[24px] text-[#6C4DEF] flex items-center gap-2 min-w-[160px]">
                                                    <Link
                                                        className="flex gap-2"
                                                        to={`riderDetails/${rider.id}`}
                                                    >
                                                        {rider.user_detail?.firstName} {rider.user_detail?.lastName}
                                                    </Link>
                                                </td>
                                                <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
                                                    {rider.user_detail?.useremail || 'N/A'}
                                                </td>
                                                <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
                                                    <span className="capitalize">{rider.vehicleType || 'N/A'}</span>
                                                </td>
                                                <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
                                                    {rider.vehicleRegistrationNumber || 'N/A'}
                                                </td>
                                                <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000] w-[120px] truncate">
                                                    {rider.drivingLicenseNumber || 'N/A'}
                                                </td>
                                                <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
                                                    {rider.drivingExperience || 0} years
                                                </td>
                                                <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
                                                    {formatDate(rider.created_at)}
                                                </td>
                                                <td>
                                                    <div className="flex justify-center items-center">
                                                        <span
                                                            className={`px-[10px] py-[4px] text-sm font-normal text-center rounded-[90px] ${rider.offerParcel
                                                                    ? "text-[#008000] bg-[#00800012]"
                                                                    : "text-[#FF0000] bg-[#ff000012]"
                                                                }`}
                                                        >
                                                            {rider.offerParcel ? "Yes" : "No"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex justify-center items-center">
                                                        <span
                                                            className={`px-[10px] py-[4px] text-sm font-normal text-center rounded-[90px] ${rider.status === "Active"
                                                                    ? "bg-[#00800012] text-[#008000]"
                                                                    : rider.status === "Inactive"
                                                                        ? "bg-[#FF00001A] text-[#800000]"
                                                                        : "bg-[#6C4DEF1A] text-[#6C4DEF]"
                                                                }`}
                                                        >
                                                            {rider.status || "Pending"}
                                                        </span>
                                                    </div>
                                                </td>
                      
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
   


                    {/* Pagination */}
                    {paginatedData.length > 0 && (
                        <div className="flex justify-between items-center mt-6">
                            <div className="text-sm text-gray-600">
                                Showing {startIndex + 1} to {endIndex} of {filteredRiders.length} riders
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange("prev")}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 border rounded disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange("next")}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 border rounded disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>}
            <Outlet />
            </>
  );
};

export default Rider;
