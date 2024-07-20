import React, { useState } from 'react';

const FilterButton = () => {
  const [filterOptions, setFilterOptions] = useState({
    column1: '',
    column2: '',
    column3: '',
  });
  const [appliedFilters, setAppliedFilters] = useState({});
  const [filteredData, setFilteredData] = useState([]);

  const handleFilterClick = () => {
    // Open filter options menu
  };

  const handleFilterChange = (column, value) => {
    setFilterOptions((prevOptions) => ({ ...prevOptions, [column]: value }));
  };

  const handleApplyFilters = () => {
    // Apply filters to data
    const filteredData = [];
    // Filter data based on filter options
    setFilteredData(filteredData);
    setAppliedFilters(filterOptions);
  };

  const handleClearFilters = () => {
    setFilterOptions({});
    setAppliedFilters({});
    setFilteredData([]);
  };

  return (
    <div>
      <button onClick={handleFilterClick}>Add Filter</button>
      {Object.keys(appliedFilters).length > 0? (
        <div>
          <p>Applied Filters:</p>
          <ul>
            {Object.keys(appliedFilters).map((column) => (
              <li key={column}>{column}: {appliedFilters[column]}</li>
            ))}
          </ul>
          <button onClick={handleClearFilters}>Clear Filters</button>
        </div>
      ) : (
        <div>
          <p>No filters applied</p>
        </div>
      )}
      <div>
        <label>Column 1:</label>
        <input
          type="text"
          value={filterOptions.column1}
          onChange={(e) => handleFilterChange('column1', e.target.value)}
        />
        <label>Column 2:</label>
        <input
          type="text"
          value={filterOptions.column2}
          onChange={(e) => handleFilterChange('column2', e.target.value)}
        />
        <label>Column 3:</label>
        <input
          type="text"
          value={filterOptions.column3}
          onChange={(e) => handleFilterChange('column3', e.target.value)}
        />
        <button onClick={handleApplyFilters}>Apply Filters</button>
      </div>
    </div>
  );
};

export default FilterButton;