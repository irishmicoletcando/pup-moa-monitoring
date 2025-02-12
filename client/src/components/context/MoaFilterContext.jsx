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

      if (updatedFilters[filterType].includes(value)) {
        updatedFilters[filterType] = updatedFilters[filterType].filter(
          (item) => item !== value
        );
      } else {
        updatedFilters[filterType] = [...updatedFilters[filterType], value];
      }

      return updatedFilters;
    });
  };

  // Function to clear all filters
  const clearFilters = () => {
    setMoaFilters({
      moaTypes: [],
      moaStatus: [],
      branch: [],
      course: [],
    });
  };

  return (
    <MoaFilterContext.Provider value={{ moaFilters, onMoaFilterChange, clearFilters }}>
      {children}
    </MoaFilterContext.Provider>
  );
};

export const useMoaFilterContext = () => useContext(MoaFilterContext);
