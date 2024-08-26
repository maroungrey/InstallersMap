import React from 'react';
import { Container } from 'react-bootstrap';
import { BatteryFilters } from '../Components/Batteries/BatteryFilters';
import { BatteryGrid } from '../Components/Batteries/BatteryGrid';
import { useBatteries } from '../Hooks/useBatteries';
import { useFilters } from '../Hooks/useFilters';

const BatteryComparison = () => {
  const { batteries, loading, error } = useBatteries();
  const { filters, setFilters, sortBy, setSortBy, filteredBatteries } = useFilters(batteries);

  return (
    <Container className="my-4">
      <h1 className="text-center mb-4">Battery Comparison</h1>
      <BatteryFilters 
        filters={filters} 
        setFilters={setFilters} 
        sortBy={sortBy} 
        setSortBy={setSortBy}
      />
      <BatteryGrid 
        batteries={filteredBatteries} 
        loading={loading} 
        error={error}
      />
    </Container>
  );
};

export default BatteryComparison;