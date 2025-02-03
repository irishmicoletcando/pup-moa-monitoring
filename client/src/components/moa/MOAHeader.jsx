import { ArrowUpDown, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function MOAHeader({ onSort, sortConfig, filters, onFilterChange, isAllSelected, isSomeSelected, onToggleSelectAll }) {
  const [openFilter, setOpenFilter] = useState(null);
  const filterRefs = useRef({}); // Store refs for each dropdown

  useEffect(() => {
    function handleClickOutside(event) {
      // Check if the click is outside all dropdowns
      if (openFilter && filterRefs.current[openFilter] && !filterRefs.current[openFilter].contains(event.target)) {
        setOpenFilter(null); // Close the dropdown
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openFilter]); // Re-run effect when openFilter changes

  const getSortIcon = (field) => {
    if (sortConfig.field === field) {
      return <ArrowUpDown className={`w-4 h-4 ml-1 ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />;
    }
    return <ArrowUpDown className="w-4 h-4 ml-1 text-gray-300" />;
  };

  const FilterDropdown = ({ type, options, selectedValues, onChange }) => {
    return (
      <div className="relative inline-block" ref={(el) => (filterRefs.current[type] = el)}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenFilter(openFilter === type ? null : type);
          }}
          className="flex items-center gap-1 hover:text-maroon text-sm whitespace-nowrap"
        >
          {type}
          <ChevronDown className="w-4 h-4" />
        </button>
        {openFilter === type && (
          <div className="absolute left-0 mt-1 h-80 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
            <div className="h-full overflow-y-auto">
              <div className="p-2">
                {options.map((option) => (
                  <label
                    key={option}
                    className="flex items-center px-2 py-1 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedValues.includes(option)}
                      onChange={() => onChange(option)}
                      className="mr-2 h-4 w-4 rounded border-gray-300 flex-shrink-0"
                    />
                    <span className="text-sm text-gray-700 break-words">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };  

  return (
    <tr className="bg-gray-50">
      <th className="w-12 p-4 text-left">
        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" onChange={onToggleSelectAll} checked={isAllSelected} ref={el => el && (el.indeterminate = isSomeSelected)}/>
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
      <th className="p-4 text-left text-sm font-medium">Company Address</th>
      <th className="p-4 text-left text-sm font-medium">Contact Person</th>
      <th className="p-4 text-left text-sm font-medium">Contact Position</th>
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
      <th className="p-4 text-left text-sm font-medium">
        <FilterDropdown
          type="Branch"
          options={['Sta. Mesa, Manila', 'Quezon City', 'San Juan City', 'Taguig City', 'Parañaque City', 'Mariveles, Bataan', 'Sta. Maria, Bulacan', 'Pulilan, Bulacan', 'Cabiao, Nueva Ecija', 'Biñan, Laguna', 'Calauan, Laguna', 'San Pedro, Laguna', 'Sta. Rosa, Laguna', 'Sto. Tomas, Batangas', 'Maragondon, Cavite', 'Alfonso, Cavite (Maragondon Annex)', 'Lopez, Quezon', 'Mulanay, Quezon', 'General Luna, Quezon (Mulanay Annex)', 'Unisan, Quezon', 'Ragay, Camarines Sur', 'Bansud, Oriental Mindoro', 'Sablayan, Occidental Mindoro']}
          selectedValues={filters.branch}
          onChange={(value) => onFilterChange('branch', value)}
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