import React, { useState, useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BatteryFilters } from '../Components/Batteries/BatteryFilters';
import { BatteryGrid } from '../Components/Batteries/BatteryGrid';
import { useBatteries } from '../Hooks/useBatteries';
import { useFilters } from '../Hooks/useFilters';
import { useSearch } from '../Hooks/useSearch';

const BatteryComparison = () => {
  const { batteries, loading, error } = useBatteries();
  const [searchTerm, setSearchTerm] = useState('');
  const { filters, setFilters, sortBy, setSortBy, applyFilters } = useFilters();
  
  const searchedBatteries = useSearch(batteries, searchTerm);
  
  const filteredAndSortedBatteries = useMemo(() => {
    return applyFilters(searchedBatteries, filters, sortBy);
  }, [searchedBatteries, filters, sortBy, applyFilters]);

  return (
    <Container fluid className="my-4">
      <h1 className="text-center mb-4">Battery Comparison</h1>
      <BatteryFilters 
        filters={filters} 
        setFilters={setFilters} 
        sortBy={sortBy} 
        setSortBy={setSortBy}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        batteries={batteries}
      />
      <BatteryGrid 
        batteries={filteredAndSortedBatteries} 
        loading={loading} 
        error={error}
      />
    </Container>
  );
};

export default BatteryComparison;