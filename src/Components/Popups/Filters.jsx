import React, { useState } from 'react';
import { DropdownIcon } from '../../assets/icon/Icon';

const Filters = ({ activeFilters, onFilterChange }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'duration') {
      onFilterChange(filterType, value); // Set single value directly
    } else {
      const newValues = activeFilters[filterType]?.includes(value)
        ? activeFilters[filterType].filter((v) => v !== value)
        : [...(activeFilters[filterType] || []), value];
      onFilterChange(filterType, newValues);
    }
  };

  const handleSelectAll = (filterType, options) => {
    const allSelected = options.every((option) => activeFilters[filterType]?.includes(option));
    const newValue = allSelected ? [] : options;
    onFilterChange(filterType, newValue);
  };

  const renderSelectedFilters = (filterType, options) => {
    const selectedOptions = Array.isArray(activeFilters[filterType])
      ? activeFilters[filterType]
      : [];
    return selectedOptions.length > 0 ? (
      <div className="mt-2">
        <strong>Selected {filterType.charAt(0).toUpperCase() + filterType.slice(1)}:</strong>
        <ul className="list-disc ml-5">
          {selectedOptions.map((option, index) => (
            <li key={index}>{option}</li>
          ))}
        </ul>
      </div>
    ) : null;
  };

  return (
    <div className="relative z-[25]">
      <div className="bg-white border-2 border-[#00000026] w-[400px] mt-4 rounded-[10px]">
        {/* Duration Dropdown */}
        <div>
          <h2
            className={`font-normal sm:text-sm md:text-base text-black py-4 px-5 rounded-[10px] cursor-pointer flex items-center justify-between ${
              activeDropdown === 'duration' ? 'bg-[#eee]' : ''
            }`}
            onClick={() => toggleDropdown('duration')}>
            <span>Duration</span>
            <div className={`${activeDropdown === 'duration' ? 'rotate-180' : null}`}>
              <DropdownIcon />
            </div>
          </h2>
          {activeDropdown === 'duration' && (
            <div className="px-5 pb-3">
              {['Today', 'Yesterday', 'This Week', '1 Month', '2 Month'].map((option) => (
                <div key={option} className="mt-2.5">
                  <input
                    type="checkbox"
                    id={option}
                    className="mr-2 accent-black"
                    checked={activeFilters.duration === option}
                    onChange={() => handleFilterChange('duration', option)}
                  />

                  <label className="text-base font-normal" htmlFor={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Service Type Dropdown */}
        <div>
          <h2
            className={`font-normal sm:text-sm md:text-base text-black py-4 px-5 rounded-[10px] cursor-pointer flex items-center justify-between ${
              activeDropdown === 'serviceType' ? 'bg-[#eee]' : ''
            }`}
            onClick={() => toggleDropdown('serviceType')}>
            <span>Service Type</span>
            <div className={`${activeDropdown === 'serviceType' ? 'rotate-180' : null}`}>
              <DropdownIcon />
            </div>
          </h2>
          {activeDropdown === 'serviceType' && (
            <div className="px-5">
              {/* Select All Checkbox */}
              <div className="mt-2.5">
                <input
                  type="checkbox"
                  id="selectAllServiceType"
                  className="mr-2 accent-black"
                  checked={[
                    'House Cleaning',
                    'Car Mechanic',
                    'Painter',
                    'Carpenter',
                    'Plumber',
                  ].every(
                    (service) =>
                      activeFilters.serviceType && activeFilters.serviceType.includes(service)
                  )}
                  onChange={() =>
                    handleSelectAll('serviceType', [
                      'House Cleaning',
                      'Car Mechanic',
                      'Painter',
                      'Carpenter',
                      'Plumber',
                    ])
                  }
                />
                <label className="text-base font-normal" htmlFor="selectAllServiceType">
                  Select All
                </label>
              </div>

              {['House Cleaning', 'Car Mechanic', 'Painter', 'Carpenter', 'Plumber'].map(
                (service) => (
                  <div key={service} className="mt-2.5">
                    <input
                      type="checkbox"
                      id={service}
                      name="serviceType"
                      className="mr-2 accent-black"
                      checked={
                        activeFilters.serviceType && activeFilters.serviceType.includes(service)
                      }
                      onChange={() => handleFilterChange('serviceType', service)}
                    />
                    <label className="text-base font-normal" htmlFor={service}>
                      {service}
                    </label>
                  </div>
                )
              )}
            </div>
          )}
          {renderSelectedFilters([
            'House Cleaning',
            'Car Mechanic',
            'Painter',
            'Carpenter',
            'Plumber',
          ])}
        </div>

        {/* Complaint Status Dropdown */}
        <div>
          <h2
            className={`font-normal sm:text-sm md:text-base text-black py-4 px-5 rounded-[10px] cursor-pointer flex items-center justify-between ${
              activeDropdown === 'complaintStatus' ? 'bg-[#eee]' : ''
            }`}
            onClick={() => toggleDropdown('complaintStatus')}>
            <span>Complaint Status</span>
            <div className={`${activeDropdown === 'complaintStatus' ? 'rotate-180' : null}`}>
              <DropdownIcon />
            </div>
          </h2>
          {activeDropdown === 'complaintStatus' && (
            <div className="px-5 pb-3">
              {/* Select All Checkbox */}
              <div className="mt-2.5">
                <input
                  type="checkbox"
                  id="selectAllComplaintStatus"
                  className="mr-2 accent-black"
                  checked={['Pending', 'Processing', 'Resolved'].every(
                    (status) =>
                      activeFilters.complaintStatus &&
                      activeFilters.complaintStatus.includes(status)
                  )}
                  onChange={() =>
                    handleSelectAll('complaintStatus', ['Pending', 'Processing', 'Resolved'])
                  }
                />
                <label className="text-base font-normal" htmlFor="selectAllComplaintStatus">
                  Select All
                </label>
              </div>

              {['Pending', 'Processing', 'Resolved'].map((status) => (
                <div key={status} className="mt-2.5">
                  <input
                    type="checkbox"
                    id={status}
                    name="complaintStatus"
                    className="mr-2 accent-black"
                    checked={
                      activeFilters.complaintStatus &&
                      activeFilters.complaintStatus.includes(status)
                    }
                    onChange={() => handleFilterChange('complaintStatus', status)}
                  />
                  <label className="text-base font-normal" htmlFor={status}>
                    {status}
                  </label>
                </div>
              ))}
            </div>
          )}
          {renderSelectedFilters(['Pending', 'Processing', 'Resolved'])}
        </div>
      </div>
    </div>
  );
};

export default Filters;
