import { useState, useMemo } from 'react';

export const useFilters = (batteries) => {
  const [filters, setFilters] = useState({ filterBy: '', filterValue: '' });
  const [sortBy, setSortBy] = useState('');

  const filteredBatteries = useMemo(() => {
    let result = [...batteries];

    if (filters.filterBy && filters.filterValue) {
      result = result.filter(battery => 
        String(battery[filters.filterBy]).toLowerCase().includes(filters.filterValue.toLowerCase())
      );
    }

    if (sortBy) {
      result.sort((a, b) => {
        if (sortBy === 'value') return (b.capacity / b.price) - (a.capacity / a.price);
        if (sortBy === 'price') return a.price - b.price;
        return b[sortBy] - a[sortBy];
      });
    }

    return result;
  }, [batteries, filters, sortBy]);

  return { filters, setFilters, sortBy, setSortBy, filteredBatteries };
};