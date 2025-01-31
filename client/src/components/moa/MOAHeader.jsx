import { ArrowUpDown, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function MOAHeader({ onSort, sortConfig, filters, onFilterChange }) {
  const [openFilter, setOpenFilter] = useState(null);
  const filterRef = useRef(null);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setOpenFilter(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSortIcon = (field) => {
    if (sortConfig.field === field) {
      return <ArrowUpDown className={`w-4 h-4 ml-1 ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />;
    }
    return <ArrowUpDown className="w-4 h-4 ml-1 text-gray-300" />;
  };

  const FilterDropdown = ({ type, options, selectedValues, onChange }) => (
    <div className="relative" ref={filterRef}>
      <button
        onClick={() => setOpenFilter(openFilter === type ? null : type)}
        className="flex items-center gap-1 hover:text-maroon"
      >
        {type}
        <ChevronDown className="w-4 h-4" />
      </button>
      {openFilter === type && (
        <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200">
          <div className="p-2">
            {options.map((option) => (
              <label key={option} className="flex items-center px-2 py-1 hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={() => onChange(option)}
                  className="mr-2 h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <tr>
      <th className="w-12 p-4 text-left">
        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
      </th>
      <th className="p-4 text-left text-sm font-medium">Name</th>
      <th className="p-4 text-left text-sm font-medium">
        <FilterDropdown
          type="Type of MOA"
          options={["Practicum", "Research", "Employment", "Scholarship"]}
          selectedValues={filters.moaTypes}
          onChange={(value) => onFilterChange('moaTypes', value)}
        />
      </th>
      <th className="p-4 text-left text-sm font-medium">Nature of Business</th>
      <th className="p-4 text-left text-sm font-medium">Contact Person</th>
      <th className="p-4 text-left text-sm font-medium">Contact Number</th>
      <th className="p-4 text-left text-sm font-medium">Email Address</th>
      <th className="p-4 text-left text-sm font-medium">
        <FilterDropdown
          type="MOA Status"
          options={["Active", "Expired", "Expiry"]}
          selectedValues={filters.moaStatus}
          onChange={(value) => onFilterChange('moaStatus', value)}
        />
      </th>
      <th className="p-4 text-left text-sm font-medium">Validity</th>
      <th className="p-4 text-left text-sm font-medium">Date Notarized</th>
      <th className="p-4 text-left text-sm font-medium">
        <button
          className="flex items-center hover:text-maroon"
          onClick={() => onSort('expiry_date')}
        >
          Expiry Date
          {getSortIcon('expiry_date')}
        </button>
      </th>
      <th className="p-4 text-left text-sm font-medium">Year Submitted to ARCDO</th>
      <th className="p-4 text-left text-sm font-medium"></th>
    </tr>
  );
}
