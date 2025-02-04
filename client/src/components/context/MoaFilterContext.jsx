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

      // Set the filter to a list with just the selected value
      updatedFilters[filterType] = [value];

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
