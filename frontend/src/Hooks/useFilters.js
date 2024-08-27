import { useState, useCallback } from 'react';

export const useFilters = () => {
  const [filters, setFilters] = useState({
    brands: [],
    voltage: '',
    chemistry: '',
  });
  const [sortBy, setSortBy] = useState('');

  const applyFilters = useCallback((batteries, filters, sortBy) => {
    return batteries
      .filter(battery => {
        return (
          (filters.brands.length === 0 || filters.brands.includes(battery.Brand)) &&
          (filters.voltage === '' || battery['Nominal V'].toString() === filters.voltage) &&
          (filters.chemistry === '' || battery.Chemistry === filters.chemistry)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'capacity') return b['Ah Capacity'] - a['Ah Capacity'];
        if (sortBy === 'warranty') return b['Full Warranty Years'] - a['Full Warranty Years'];
        if (sortBy === 'weight') return a['Weight(lbs)'] - b['Weight(lbs)'];
        if (sortBy === 'kWh') return b['Total kWh'] - a['Total kWh'];
        return 0;
      });
  }, []);

  return {
    filters,
    setFilters,
    sortBy,
    setSortBy,
    applyFilters
  };
};