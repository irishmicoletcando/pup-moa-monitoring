import { ArrowUpDown, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useMoaFilterContext } from "../context/MoaFilterContext";
import ReactDOM from "react-dom";

export default function MOAHeader({
  onSort,
  sortConfig,
  filters,
  onFilterChange,
  isAllSelected,
  isSomeSelected,
  onToggleSelectAll,
}) {
  const [openFilter, setOpenFilter] = useState(null);
  const filterRefs = useRef({}); // Store refs for each dropdown
  const { moaFilters, onMoaFilterChange } = useMoaFilterContext(); // Filter from dashboard context

  useEffect(() => {
    function handleClickOutside(event) {
      // Check if the click is outside all dropdowns
      if (
        openFilter &&
        filterRefs.current[openFilter] &&
        !filterRefs.current[openFilter].contains(event.target)
      ) {
        setOpenFilter(null); // Close the dropdown
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openFilter]); // Re-run effect when openFilter changes

  const getSortIcon = (field) => {
    if (sortConfig.field === field) {
      return (
        <ArrowUpDown
          className={`w-4 h-4 ml-1 ${
            sortConfig.direction === "asc" ? "rotate-180" : ""
          }`}
        />
      );
    }
    return <ArrowUpDown className="w-4 h-4 ml-1 text-gray-300" />;
  };

  const FilterDropdown = ({ type, options, selectedValues, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const [dropdownPosition, setDropdownPosition] = useState(null); // Start as null to prevent flicker
  
    useEffect(() => {
      function handleClickOutside(event) {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      }
  
      function updateDropdownPosition() {
        if (!buttonRef.current) return;
  
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
  
        setDropdownPosition({
          top: buttonRect.bottom + scrollTop + 4, // Stay below button
          left: buttonRect.left + scrollLeft,
        });
      }
  
      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", updateDropdownPosition, true);
        window.addEventListener("resize", updateDropdownPosition);
        updateDropdownPosition(); 
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
        window.removeEventListener("scroll", updateDropdownPosition, true);
        window.removeEventListener("resize", updateDropdownPosition);
      }
  
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        window.removeEventListener("scroll", updateDropdownPosition, true);
        window.removeEventListener("resize", updateDropdownPosition);
      };
    }, [isOpen]);
  
    return (
      <>
        {/* Filter Button */}
        <button
          ref={buttonRef}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
          className="flex items-center gap-1 hover:text-maroon text-sm whitespace-nowrap"
        >
          {type}
          <ChevronDown className="w-4 h-4" />
        </button>
  
        {/* Dropdown - Renders only when position is available (Prevents flicker) */}
        {isOpen && dropdownPosition &&
          ReactDOM.createPortal(
            <div
              ref={dropdownRef}
              style={{
                position: "absolute",
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                zIndex: 50,
                transition: "top 0.15s ease-out, left 0.15s ease-out", // Smooth transition
              }}
              className="w-48 bg-white rounded-md shadow-lg border border-gray-200"
            >
              <div className="max-h-80 overflow-y-auto p-2">
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
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>,
            document.body // Moves dropdown out of <thead> into <body>
          )}
      </>
    );
  };
  
  return (
    <tr className="bg-gray-50">
      <th className="w-12 p-4 text-left">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300"
          onChange={onToggleSelectAll}
          checked={isAllSelected}
          ref={(el) => el && (el.indeterminate = isSomeSelected)}
        />
      </th>
      <th className="p-4 text-left text-sm font-medium min-w-[150px] max-w-xs break-words whitespace-normal">Name</th>
      <th className="p-4 text-left text-sm font-medium min-w-[80px] max-w-xs break-words whitespace-normal">
        <FilterDropdown
          type="Type of MOA"
          options={["Practicum", "Research", "Employment", "Scholarship"]}
          selectedValues={filters.moaTypes}
          onChange={(value) => onFilterChange("moaTypes", value)}
        />
      </th>
      <th className="p-4 text-left text-sm font-medium min-w-[100px] max-w-xs break-words whitespace-normal">Nature of Business</th>
      <th className="p-4 text-left text-sm font-medium min-w-[320px] max-w-xs break-words whitespace-normal">Company Address</th>
      <th className="p-4 text-left text-sm font-medium min-w-[150px] max-w-xs break-words whitespace-normal">Contact Person</th>
      <th className="p-4 text-left text-sm font-medium min-w-[100px] max-w-xs break-words whitespace-normal">Contact Position</th>
      <th className="p-4 text-left text-sm font-medium min-w-[110px] max-w-xs break-words whitespace-normal">Contact Number</th>
      <th className="p-4 text-left text-sm font-medium min-w-[20px] max-w-xs break-words whitespace-normal">Email Address</th>
      <th className="p-4 text-left text-sm font-medium min-w-[20px] max-w-xs break-words whitespace-normal">
        <FilterDropdown
          type="MOA Status"
          options={["Active", "Expired", "Expiry"]}
          selectedValues={filters.moaStatus}
          onChange={(value) => onFilterChange("moaStatus", value)}
        />
      </th>
      <th className="p-4 text-left text-sm font-medium min-w-[120px] max-w-xs break-words whitespace-normal">
        <FilterDropdown
          type="Branch"
          options={[
            "Sta. Mesa, Manila",
            "Quezon City",
            "San Juan City",
            "Taguig City",
            "Parañaque City",
            "Mariveles, Bataan",
            "Sta. Maria, Bulacan",
            "Pulilan, Bulacan",
            "Cabiao, Nueva Ecija",
            "Biñan, Laguna",
            "Calauan, Laguna",
            "San Pedro, Laguna",
            "Sta. Rosa, Laguna",
            "Sto. Tomas, Batangas",
            "Maragondon, Cavite",
            "Alfonso, Cavite (Maragondon Annex)",
            "Lopez, Quezon",
            "Mulanay, Quezon",
            "General Luna, Quezon (Mulanay Annex)",
            "Unisan, Quezon",
            "Ragay, Camarines Sur",
            "Bansud, Oriental Mindoro",
            "Sablayan, Occidental Mindoro",
          ]}
          selectedValues={filters.branch}
          onChange={(value) => onFilterChange("branch", value)}
        />
      </th>
      <th className="p-4 text-center text-sm font-medium min-w-[20px] max-w-xs break-words whitespace-normal">
        <FilterDropdown
          type="Origin Course"
          options={[
            "ABF",
            "ABELS",
            "ABLCS",
            "AB-PHILO",
            "ATM",
            "BA Broadcasting",
            "BACR",
            "BADPR",
            "BAH",
            "BAIS",
            "BAJ",
            "BAPS",
            "BAPE",
            "BAS",
            "BPA",
            "BPE",
            "BPEA",
            "BPAPFM",
            "BSA",
            "BSABFM",
            "BSAM",
            "BSAPMATH",
            "BSARCHI",
            "BS-ARCH",
            "BSBAFM",
            "BSBA-HRM",
            "BSBAHRM",
            "BSBA-MM",
            "BSBIO",
            "BSC",
            "BSCE",
            "BSCHEM",
            "BSCS",
            "BSCpE",
            "BS-ENTREP",
            "BSENTREP",
            "BSENTREP-UN",
            "BSEE",
            "BSECE",
            "BSE",
            "BSEd",
            "BSEDEN",
            "BSEDFL",
            "BSEDMT",
            "BSEDSS",
            "BSEP",
            "BSESS",
            "BSFT",
            "BSHM",
            "BSID",
            "BSIE",
            "BSIT",
            "BSMA",
            "BSMATH",
            "BSME",
            "BSND",
            "BSOALT",
            "BSOA",
            "BSPHY",
            "BSPYS",
            "BSRE",
            "BSSTAT",
            "BSTM",
            "BSTRM",
            "BTLE",
            "BTLEd",
            "BBTLEDHE",
            "BBTLEDHE-CL",
            "BCOOP",
            "DCET",
            "DEET",
            "DECET",
            "DICT",
            "DMET",
            "DOMT",
            "DOMTLOM",
            "DOMTMOM",
          ]}
          selectedValues={filters.course}
          onChange={(value) => onFilterChange("course", value)}
        />
      </th>
      <th className="p-4 text-left text-sm font-medium min-w-[20px] max-w-xs break-words whitespace-normal">Validity</th>
      <th className="p-4 text-left text-sm font-medium min-w-[50px] max-w-xs break-words whitespace-normal">Date Notarized</th>
      <th className="p-4 text-left text-sm font-medium min-w-[20px] max-w-xs break-words whitespace-normal">
        <button
          className="flex items-center hover:text-maroon"
          onClick={() => onSort("expiry_date")}
        >
          Expiry Date
          {getSortIcon("expiry_date")}
        </button>
      </th>
      <th className="p-4 text-left text-sm font-medium min-w-[100px] max-w-xs break-words whitespace-normal">Year Submitted to ARCDO</th>

      <th className="p-4 text-left text-sm font-medium"></th>
    </tr>
  );
}