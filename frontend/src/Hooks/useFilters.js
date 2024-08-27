import { useState } from 'react';

export const useFilters = () => {
  const [filters, setFilters] = useState({
    brands: [],
    voltage: '',
    chemistry: '',
  });
  const [sortBy, setSortBy] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setPage(1); // Reset to first page when sort changes
  };

  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setPage(1); // Reset to first page when search term changes
  };

  return {
    filters,
    sortBy,
    searchTerm,
    page,
    setPage,
    handleFilterChange,
    handleSortChange,
    handleSearchChange,
  };
};
