'use client'

import React, { useState } from 'react';

interface FilterBarProps {
  filters: string[];
  onFilterChange: (filter: string | null) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const handleFilterClick = (filter: string) => {
    setSelectedFilter(filter === selectedFilter ? null : filter);
    onFilterChange(filter === selectedFilter ? null : filter);
  };

  return (
    <div className="flex space-x-4 p-4">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => handleFilterClick(filter)}
          className={`
            px-6 py-2 rounded-full transition-all duration-300 ease-in-out
            ${selectedFilter === filter
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-purple-400 hover:text-white'
            }
          `}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;