import { createContext, useContext, useState } from "react";

const MoaFilterContext = createContext();

export const MoaFilterProvider = ({ children }) => {
  const [moaFilters, setMoaFilters] = useState({
    moaTypes: [],
    moaStatus: [],
    branch: [],
    course: [],
  });

  const onMoaFilterChange = (filterType, value) => {
    setMoaFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      
      // If the value is already in the filter array, remove it
      if (updatedFilters[filterType].includes(value)) {
        updatedFilters[filterType] = updatedFilters[filterType].filter(
          (item) => item !== value
        );
      } else {
        // Otherwise, add the value to the filter array
        updatedFilters[filterType] = [...updatedFilters[filterType], value];
      }

      return updatedFilters;
    });
  };

  return (
    <MoaFilterContext.Provider value={{ moaFilters, onMoaFilterChange }}>
      {children}
    </MoaFilterContext.Provider>
  );
};

export const useMoaFilterContext = () => useContext(MoaFilterContext);
