/* eslint-disable no-unused-vars */
import { useEffect, useState, useMemo } from "react";
import { supabase } from "../../store/supabaseCreateClient";
import { toast } from "react-toastify";
import avatarPlaceholder from "../../assets/Images/Png/dummyimage.jpg";
import {
  FaCar,
  FaUser,
  FaPhoneAlt,
  FaStar,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaInfoCircle,
  FaExclamationTriangle,
  FaCopy,
  FaCheck,
  FaCalendarAlt,
  FaShieldAlt,
  FaSync,
  FaChevronRight,
} from "react-icons/fa";
import { MdAirlineSeatReclineNormal, MdOutlineDirectionsCar, MdClose } from "react-icons/md";
import { CiSearch } from "react-icons/ci";

export default function BlaBlaRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [dateFilter, setDateFilter] = useState("today"); // 'today' | 'yesterday' | 'custom' | 'all'
  const [customDate, setCustomDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'active' | 'completed' | 'cancelled'
  const [searchTerm, setSearchTerm] = useState("");

  // Modal & interactive state
  const [selectedRide, setSelectedRide] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Helper to compute ISO start/end for date filters
  const getDateRange = (filterType, customDateStr) => {
    const now = new Date();
    if (filterType === "today") {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      return { start: start.toISOString(), end: end.toISOString() };
    } else if (filterType === "yesterday") {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const start = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0, 0);
      const end = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59, 999);
      return { start: start.toISOString(), end: end.toISOString() };
    } else if (filterType === "custom" && customDateStr) {
      const [year, month, day] = customDateStr.split("-").map(Number);
      const start = new Date(year, month - 1, day, 0, 0, 0, 0);
      const end = new Date(year, month - 1, day, 23, 59, 59, 999);
      return { start: start.toISOString(), end: end.toISOString() };
    }
    return null; // 'all' time
  };

  // Fetch rides from Supabase
  const fetchRides = async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("CarpoolRides")
        .select(`
          *,
          CarpoolBookings (*)
        `)
        .order("created_at", { ascending: false });

      const dateRange = getDateRange(dateFilter, customDate);
      if (dateRange) {
        query = query.gte("created_at", dateRange.start).lte("created_at", dateRange.end);
      }

      const { data, error: queryError } = await query;
      if (queryError) throw queryError;
      setRides(data || []);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching carpool rides:", err);
      setError(err.message || "Failed to load carpool rides");
      toast.error("Failed to load carpool history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, [dateFilter, customDate]);

  // Copy ID to clipboard
  const handleCopyId = (e, id) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Ride ID copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter rides based on search term & status
  const filteredRides = useMemo(() => {
    return rides.filter((ride) => {
      // Status filter
      if (statusFilter !== "all") {
        if ((ride.status || "").toLowerCase() !== statusFilter.toLowerCase()) {
          return false;
        }
      }

      // Search filter
      if (searchTerm.trim() !== "") {
        const query = searchTerm.toLowerCase();
        const driverName = (ride.driver_name || "").toLowerCase();
        const driverPhone = (ride.driver_phone || "").toLowerCase();
        const originCity = (ride.origin_city || "").toLowerCase();
        const destCity = (ride.destination_city || "").toLowerCase();
        const rideId = (ride.id || "").toLowerCase();
        const vehicleNumber = (ride.vehicle_number || "").toLowerCase();
        const vehicleModel = (ride.vehicle_model || "").toLowerCase();

        const matches =
          driverName.includes(query) ||
          driverPhone.includes(query) ||
          originCity.includes(query) ||
          destCity.includes(query) ||
          rideId.includes(query) ||
          vehicleNumber.includes(query) ||
          vehicleModel.includes(query);

        if (!matches) return false;
      }

      return true;
    });
  }, [rides, statusFilter, searchTerm]);

  // Statistics across current view
  const stats = useMemo(() => {
    let totalRides = filteredRides.length;
    let activeRides = 0;
    let completedRides = 0;
    let cancelledRides = 0;
    let totalRevenue = 0;
    let totalBookedSeats = 0;

    filteredRides.forEach((ride) => {
      const st = (ride.status || "").toLowerCase();
      if (st === "active") activeRides++;
      else if (st === "completed") completedRides++;
      else if (st === "cancelled") cancelledRides++;

      const bookings = ride.CarpoolBookings || [];
      bookings.forEach((b) => {
        if ((b.status || "").toLowerCase() !== "cancelled") {
          totalRevenue += Number(b.total_fare || 0);
          totalBookedSeats += Number(b.seats_booked || 0);
        }
      });
    });

    return {
      totalRides,
      activeRides,
      completedRides,
      cancelledRides,
      totalRevenue,
      totalBookedSeats,
    };
  }, [filteredRides]);

  // Pagination slice
  const totalPages = Math.ceil(filteredRides.length / itemsPerPage) || 1;
  const paginatedRides = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRides.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRides, currentPage, itemsPerPage]);

  // Date formatters
  const formatDateTime = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "active") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          ACTIVE
        </span>
      );
    }
    if (s === "completed") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <FaCheckCircle className="text-blue-500 text-[10px]" />
          COMPLETED
        </span>
      );
    }
    if (s === "cancelled") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <FaTimesCircle className="text-rose-500 text-[10px]" />
          CANCELLED
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <FaClock className="text-amber-500 text-[10px]" />
        {(status || "PENDING").toUpperCase()}
      </span>
    );
  };

  // Helper for total ride revenue calculation
  const getRideRevenue = (ride) => {
    const bookings = ride.CarpoolBookings || [];
    return bookings.reduce((sum, b) => {
      if ((b.status || "").toLowerCase() !== "cancelled") {
        return sum + Number(b.total_fare || 0);
      }
      return sum;
    }, 0);
  };

  return (
    <div className="space-y-5 pb-8">
      {/* 1. Header Banner & Read-Only Notice */}
      <div className="bg-white rounded-[12px] p-5 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6C4DEF]/10 flex items-center justify-center text-[#6C4DEF]">
              <FaCar className="text-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">Bla Bla Rides History</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                  <FaShieldAlt className="text-slate-500 text-[11px]" />
                  Read-Only Archive
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Inspect carpool rides, driver profiles, passenger bookings, routes, and fare audits.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRides}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-[#6C4DEF] bg-[#6C4DEF]/10 hover:bg-[#6C4DEF]/20 rounded-lg transition duration-200 disabled:opacity-50"
            title="Refresh rides data"
          >
            <FaSync className={`text-xs ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 2. Stat Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Total Rides</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{stats.totalRides}</p>
          <span className="text-[11px] text-gray-400">In selected filter</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-xs text-emerald-600 font-medium">Active Rides</p>
          <p className="text-xl font-bold text-emerald-700 mt-1">{stats.activeRides}</p>
          <span className="text-[11px] text-emerald-500/80">Available on road</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-xs text-blue-600 font-medium">Completed</p>
          <p className="text-xl font-bold text-blue-700 mt-1">{stats.completedRides}</p>
          <span className="text-[11px] text-blue-500/80">Fulfilled trips</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-xs text-rose-600 font-medium">Cancelled</p>
          <p className="text-xl font-bold text-rose-700 mt-1">{stats.cancelledRides}</p>
          <span className="text-[11px] text-rose-500/80">Terminated rides</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-xs text-purple-600 font-medium">Booked Seats</p>
          <p className="text-xl font-bold text-purple-700 mt-1">{stats.totalBookedSeats}</p>
          <span className="text-[11px] text-purple-500/80">Passenger seats</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-xs text-[#6C4DEF] font-medium">Total Revenue</p>
          <p className="text-xl font-bold text-[#6C4DEF] mt-1">₹{stats.totalRevenue.toLocaleString("en-IN")}</p>
          <span className="text-[11px] text-gray-400">From bookings</span>
        </div>
      </div>

      {/* 3. Filter Toolbar & Search */}
      <div className="bg-white rounded-[12px] p-4 shadow-sm border border-slate-100 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Date Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider me-1">
              Date:
            </span>
            <button
              onClick={() => setDateFilter("today")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${dateFilter === "today"
                  ? "bg-[#6C4DEF] text-white shadow-sm"
                  : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                }`}
            >
              Today
            </button>
            <button
              onClick={() => setDateFilter("yesterday")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${dateFilter === "yesterday"
                  ? "bg-[#6C4DEF] text-white shadow-sm"
                  : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                }`}
            >
              Yesterday
            </button>
            <button
              onClick={() => setDateFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${dateFilter === "all"
                  ? "bg-[#6C4DEF] text-white shadow-sm"
                  : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                }`}
            >
              All Time
            </button>

            {/* Custom Date Picker */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition ${dateFilter === "custom"
                  ? "border-[#6C4DEF] bg-[#6C4DEF]/5 text-[#6C4DEF]"
                  : "border-slate-200 bg-white text-gray-600"
                }`}
            >
              <FaCalendarAlt className="text-xs" />
              <input
                type="date"
                value={customDate}
                onChange={(e) => {
                  setCustomDate(e.target.value);
                  setDateFilter("custom");
                }}
                className="bg-transparent text-xs font-medium focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Status Filter Dropdown / Tabs */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Status:
            </span>
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
              {["all", "active", "completed", "cancelled"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-md capitalize transition ${statusFilter === st
                      ? "bg-white text-[#6C4DEF] shadow-sm font-semibold"
                      : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <CiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search by Driver Name, Mobile Number, Origin / Destination City, Vehicle, or Ride ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C4DEF]/30 focus:border-[#6C4DEF]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* 4. Table Section */}
      <div className="bg-white rounded-[12px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4"># / Ride ID</th>
                <th className="py-3 px-4">Driver Profile</th>
                <th className="py-3 px-4">Route</th>
                <th className="py-3 px-4">Schedule</th>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Seats</th>
                <th className="py-3 px-4">Fare & Revenue</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <FaSync className="animate-spin text-2xl text-[#6C4DEF]" />
                      <p className="text-sm font-medium text-gray-600">Loading carpool rides history...</p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-rose-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FaExclamationTriangle className="text-2xl" />
                      <p className="font-medium">{error}</p>
                      <button
                        onClick={fetchRides}
                        className="mt-2 text-xs font-semibold px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100"
                      >
                        Try Again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : paginatedRides.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
                      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-gray-400">
                        <FaCar className="text-2xl" />
                      </div>
                      <p className="text-base font-semibold text-gray-700">No Carpool Rides Found</p>
                      <p className="text-xs text-gray-500 max-w-sm">
                        {dateFilter === "today"
                          ? "No rides were published today. Try selecting 'All Time' or 'Yesterday' to inspect previous rides."
                          : "No rides matched the selected status and search filters."}
                      </p>
                      {dateFilter !== "all" && (
                        <button
                          onClick={() => setDateFilter("all")}
                          className="mt-1 text-xs font-semibold px-3.5 py-1.5 bg-[#6C4DEF] text-white rounded-lg hover:bg-[#5839db] transition"
                        >
                          View All Time Rides
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRides.map((ride, index) => {
                  const rideRevenue = getRideRevenue(ride);
                  const bookedSeats = (ride.total_seats || 0) - (ride.available_seats || 0);
                  const shortId = (ride.id || "").substring(0, 8);

                  return (
                    <tr
                      key={ride.id}
                      className="hover:bg-slate-50/70 transition duration-150 cursor-pointer"
                      onClick={() => setSelectedRide(ride)}
                    >
                      {/* # / Ride ID */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-400">
                            {(currentPage - 1) * itemsPerPage + index + 1}.
                          </span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs font-medium text-gray-800">
                                #{shortId}
                              </span>
                              <button
                                onClick={(e) => handleCopyId(e, ride.id)}
                                className="text-gray-400 hover:text-[#6C4DEF] text-xs p-1"
                                title="Copy Full Ride ID"
                              >
                                {copiedId === ride.id ? (
                                  <FaCheck className="text-emerald-500" />
                                ) : (
                                  <FaCopy />
                                )}
                              </button>
                            </div>
                            <span className="text-[11px] text-gray-400 block">
                              {formatDateTime(ride.created_at)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Driver Info */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={ride.driver_avatar || avatarPlaceholder}
                            alt={ride.driver_name || "Driver"}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = avatarPlaceholder;
                            }}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-gray-900">
                                {ride.driver_name || "Unnamed Driver"}
                              </span>
                              {ride.is_id_verified && (
                                <span title="ID Verified">
                                  <FaCheckCircle className="text-emerald-500 text-xs" />
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                              <span>{ride.driver_phone || "No phone"}</span>
                              {ride.driver_rating ? (
                                <span className="flex items-center gap-0.5 text-amber-500 font-medium">
                                  <FaStar className="text-[10px]" />
                                  {ride.driver_rating}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Route */}
                      <td className="py-3.5 px-4 min-w-[200px]">
                        <div className="flex items-center gap-2 font-medium text-gray-800 text-xs">
                          <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">
                            {ride.origin_city || "Origin"}
                          </span>
                          <span className="text-gray-400">➔</span>
                          <span className="text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded font-semibold">
                            {ride.destination_city || "Destination"}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500 truncate max-w-[220px] mt-1" title={`${ride.origin_address} → ${ride.destination_address}`}>
                          {ride.origin_address}
                        </div>
                      </td>

                      {/* Schedule */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="text-xs font-medium text-gray-900">
                          {ride.departure_date || "Date N/A"}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <FaClock className="text-[10px] text-gray-400" />
                          {ride.departure_time || "Time N/A"}
                          {ride.estimated_duration && (
                            <span className="text-[10px] text-gray-400">({ride.estimated_duration})</span>
                          )}
                        </div>
                      </td>

                      {/* Vehicle */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                            {ride.vehicle_type || "Car"}
                          </span>
                          <span className="text-xs font-medium text-gray-800">
                            {ride.vehicle_model || "Standard"}
                          </span>
                        </div>
                        {ride.vehicle_number ? (
                          <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                            {ride.vehicle_number}
                          </div>
                        ) : null}
                      </td>

                      {/* Seats */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <MdAirlineSeatReclineNormal className="text-gray-500 text-base" />
                          <span className="font-semibold text-xs text-gray-900">
                            {Math.max(0, bookedSeats)} / {ride.total_seats || 0}
                          </span>
                          <span className="text-[11px] text-gray-500">Booked</span>
                        </div>
                        <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                          <div
                            className="bg-[#6C4DEF] h-full"
                            style={{
                              width: `${Math.min(
                                100,
                                ((bookedSeats || 0) / (ride.total_seats || 1)) * 100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </td>

                      {/* Fare & Revenue */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="text-xs font-semibold text-gray-900">
                          ₹{Number(ride.price_per_seat || 0).toLocaleString("en-IN")}{" "}
                          <span className="text-[10px] font-normal text-gray-400">/ seat</span>
                        </div>
                        <div className="text-[11px] text-[#6C4DEF] font-medium mt-0.5">
                          Collected: ₹{rideRevenue.toLocaleString("en-IN")}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getStatusBadge(ride.status)}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRide(ride);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-[#6C4DEF] bg-[#6C4DEF]/10 hover:bg-[#6C4DEF] hover:text-white rounded-lg transition duration-200"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 5. Pagination Footer */}
        {!loading && filteredRides.length > 0 && (
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
            <div>
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900">
                {Math.min(currentPage * itemsPerPage, filteredRides.length)}
              </span>{" "}
              of <span className="font-semibold text-gray-900">{filteredRides.length}</span> rides
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white font-medium"
              >
                Previous
              </button>
              <span className="px-3 py-1.5 font-semibold text-gray-800">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 6. Read-Only Ride Details Modal */}
      {selectedRide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setSelectedRide(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-gray-900">Ride Details Breakdown</h2>
                  {getStatusBadge(selectedRide.status)}
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-700">
                    ID: {selectedRide.id}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Published on: {formatDateTime(selectedRide.created_at)}
                </p>
              </div>
              <button
                onClick={() => setSelectedRide(null)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-slate-100 rounded-full transition"
                title="Close Modal"
              >
                <MdClose className="text-2xl" />
              </button>
            </div>

            {/* Cancelled Banner if ride is cancelled or has notes */}
            {selectedRide.status?.toLowerCase() === "cancelled" && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
                <FaExclamationTriangle className="text-rose-500 text-xl flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-rose-800">This Ride Has Been Cancelled</h4>
                  <p className="text-xs text-rose-700 mt-0.5">
                    <span className="font-semibold">Reason / Cancellation Notes: </span>
                    {selectedRide.notes || "No cancellation reason provided by the driver."}
                  </p>
                </div>
              </div>
            )}

            {/* Driver Profile & Vehicle Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Driver Details Card */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/70 space-y-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FaUser className="text-[#6C4DEF]" /> Driver Information
                </h3>
                <div className="flex items-center gap-3">
                  <img
                    src={selectedRide.driver_avatar || avatarPlaceholder}
                    alt={selectedRide.driver_name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-gray-900">
                        {selectedRide.driver_name || "N/A"}
                      </span>
                      {selectedRide.is_id_verified && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          ID Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                      <FaPhoneAlt className="text-gray-400 text-[10px]" />
                      {selectedRide.driver_phone || "N/A"}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1 text-amber-500 font-semibold">
                        <FaStar className="text-xs" />
                        {selectedRide.driver_rating || "Unrated"}
                      </span>
                      {selectedRide.driver_reviews_count ? (
                        <span>({selectedRide.driver_reviews_count} reviews)</span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle & Preferences Card */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/70 space-y-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <MdOutlineDirectionsCar className="text-[#6C4DEF] text-base" /> Vehicle & Preferences
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Vehicle Model</span>
                    <span className="font-semibold text-gray-800">
                      {selectedRide.vehicle_model || "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Plate Number</span>
                    <span className="font-semibold text-gray-800 font-mono">
                      {selectedRide.vehicle_number || "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Vehicle Type</span>
                    <span className="font-semibold text-gray-800">
                      {selectedRide.vehicle_type || "Car"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Route Description</span>
                    <span className="font-semibold text-gray-800 truncate block">
                      {selectedRide.route_description || "Direct Highway"}
                    </span>
                  </div>
                </div>

                {/* Amenities Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedRide.has_ac && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      AC Available
                    </span>
                  )}
                  {selectedRide.has_luggage_space && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      Luggage Space
                    </span>
                  )}
                  {selectedRide.is_ladies_only && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-pink-50 text-pink-700 border border-pink-200">
                      Ladies Only
                    </span>
                  )}
                  {selectedRide.is_instant_booking && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Instant Booking
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Route & Schedule Timeline */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/70 space-y-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <FaMapMarkerAlt className="text-[#6C4DEF]" /> Journey Route & Timings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[9px] mt-1 flex-shrink-0">
                    A
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Pickup Origin</span>
                    <p className="text-sm font-bold text-gray-900">{selectedRide.origin_city}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{selectedRide.origin_address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[9px] mt-1 flex-shrink-0">
                    B
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Drop Destination</span>
                    <p className="text-sm font-bold text-gray-900">{selectedRide.destination_city}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{selectedRide.destination_address}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/70 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-gray-400 block text-[11px]">Departure Date</span>
                  <span className="font-semibold text-gray-800">{selectedRide.departure_date}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Departure Time</span>
                  <span className="font-semibold text-gray-800">{selectedRide.departure_time}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Estimated Duration</span>
                  <span className="font-semibold text-gray-800">
                    {selectedRide.estimated_duration || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Seat Price</span>
                  <span className="font-semibold text-[#6C4DEF] text-sm">
                    ₹{Number(selectedRide.price_per_seat || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Passenger Bookings Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <FaUsers className="text-[#6C4DEF]" />
                  Booked Passengers
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[#6C4DEF]/10 text-[#6C4DEF]">
                    {(selectedRide.CarpoolBookings || []).length} Bookings
                  </span>
                </h3>
              </div>

              {!(selectedRide.CarpoolBookings && selectedRide.CarpoolBookings.length > 0) ? (
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-6 text-center text-gray-500">
                  <p className="text-sm font-medium">No passengers have booked this ride yet.</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Available seats: {selectedRide.available_seats || selectedRide.total_seats} / {selectedRide.total_seats}
                  </p>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                  {selectedRide.CarpoolBookings.map((booking) => {
                    const isCancelled = (booking.status || "").toLowerCase() === "cancelled";
                    return (
                      <div
                        key={booking.id}
                        className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${isCancelled ? "bg-rose-50/30" : "bg-white"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={booking.passenger_avatar || avatarPlaceholder}
                            alt={booking.passenger_name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-gray-900 text-sm">
                                {booking.passenger_name || "Passenger"}
                              </span>
                              {booking.passenger_is_verified && (
                                <FaCheckCircle className="text-emerald-500 text-xs" title="Verified Passenger" />
                              )}
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${isCancelled
                                    ? "bg-rose-100 text-rose-800"
                                    : "bg-emerald-100 text-emerald-800"
                                  }`}
                              >
                                {(booking.status || "CONFIRMED").toUpperCase()}
                              </span>
                            </div>
                            <p className="text-gray-500 flex items-center gap-1 mt-0.5">
                              <FaPhoneAlt className="text-gray-400 text-[10px]" />
                              {booking.passenger_phone || "No phone"}
                            </p>
                            <div className="text-[11px] text-gray-400 mt-1">
                              Pickup: <span className="text-gray-600">{booking.pickup_location || "Default"}</span> |
                              Drop: <span className="text-gray-600">{booking.drop_location || "Default"}</span>
                            </div>
                            {booking.notes && (
                              <p className="text-[11px] text-rose-600 mt-1">
                                Note: {booking.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-6 self-end md:self-center">
                          <div className="text-right">
                            <span className="text-gray-400 block text-[10px]">Seats</span>
                            <span className="font-bold text-gray-800">
                              {booking.seats_booked || 1} Seat(s)
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-gray-400 block text-[10px]">Fare</span>
                            <span className="font-bold text-[#6C4DEF] text-sm">
                              ₹{Number(booking.total_fare || 0).toLocaleString("en-IN")}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-gray-400 block text-[10px]">Payment</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 uppercase">
                              {(booking.payment_status || "CASH").replace(/_/g, " ")}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Read-Only Disclaimer Footer */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">

              <button
                onClick={() => setSelectedRide(null)}
                className="px-5 py-2 text-sm font-semibold bg-gray-900 text-white hover:bg-gray-800 rounded-xl transition"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
