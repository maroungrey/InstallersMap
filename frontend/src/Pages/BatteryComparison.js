import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { BatteryFilters } from '../Components/Batteries/BatteryFilters';
import { BatteryGrid } from '../Components/Batteries/BatteryGrid';
import { ComparisonSection } from '../Components/Batteries/ComparisonSection';
import { useBatteries } from '../Hooks/useBatteries';
import { useFilters } from '../Hooks/useFilters';
import { useSearch } from '../Hooks/useSearch';

const BatteryComparison = () => {
  const { batteries, loading, error } = useBatteries();
  const [searchTerm, setSearchTerm] = useState('');
  const { filters, setFilters, sortBy, setSortBy, applyFilters } = useFilters();
  const [selectedBatteries, setSelectedBatteries] = useState([]);
  const [displayCount, setDisplayCount] = useState(6);
  
  const searchedBatteries = useSearch(batteries, searchTerm);
  
  const filteredAndSortedBatteries = useMemo(() => {
    return applyFilters(searchedBatteries, filters, sortBy);
  }, [searchedBatteries, filters, sortBy, applyFilters]);

  const handleLoadMore = () => {
    setDisplayCount(prevCount => prevCount + 12);
  };

  const handleSelectBattery = (battery) => {
    setSelectedBatteries(prev => 
      prev.find(b => b.id === battery.id)
        ? prev.filter(b => b.id !== battery.id)
        : [...prev, battery]
    );
  };

  return (
    <Container fluid className="my-4">
      {selectedBatteries.length > 0 && (
        <ComparisonSection 
          selectedBatteries={selectedBatteries}
          onClearSelection={() => setSelectedBatteries([])}
        />
      )}
      <br></br><br></br>
      <h1 className="text-center mb-4">Battery Comparison</h1>
      <Row>
        <Col md={3}>
          {/* Brand filter section */}
          <BatteryFilters
            filters={filters}
            setFilters={setFilters}
            batteries={batteries}
            showOnlyBrands={true}
          />
        </Col>
        <Col md={9}>
          <Row>
            {/* Battery filters section */}
            <Col xs={12}>
              <BatteryFilters
                filters={filters}
                setFilters={setFilters}
                sortBy={sortBy}
                setSortBy={setSortBy}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                batteries={batteries}
                showOnlyBrands={false}
              />
            </Col>
          </Row>
          <Row>
            {/* Battery grid section */}
            <Col xs={12}>
              <BatteryGrid 
                batteries={filteredAndSortedBatteries.slice(0, displayCount)} 
                loading={loading} 
                error={error}
                onSelectBattery={handleSelectBattery}
                selectedBatteries={selectedBatteries}
                onLoadMore={handleLoadMore}
              />
              {displayCount < filteredAndSortedBatteries.length && (
                <div className="text-center mt-3">
                  <Button onClick={handleLoadMore}>Load More</Button>
                </div>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default BatteryComparison;