import { useEffect, useCallback } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { BatteryFilters } from '../Components/Batteries/BatteryFilters';
import { BatteryGrid } from '../Components/Batteries/BatteryGrid';
import { ComparisonSection } from '../Components/Batteries/ComparisonSection';
import { useBatteryData } from '../Hooks/useBatteryData';
import { useFilters } from '../Hooks/useFilters';
import { useBatterySelection } from '../Hooks/useBatterySelection';

const BatteryComparison = () => {
  const {
    filters,
    sortBy,
    searchTerm,
    handleFilterChange,
    handleSortChange,
    handleSearchChange,
  } = useFilters();

  const {
    batteries,
    allBrands,
    loading,
    error,
    hasMore,
    loadMore,
    totalCount
  } = useBatteryData(filters, sortBy, searchTerm);

  const {
    selectedBatteries,
    handleSelectBattery,
    handleRemoveBattery,
    clearSelection,
  } = useBatterySelection();

  const handleSuggestBattery = () => {
    // Implement your battery suggestion logic here
    console.log('Suggesting a battery based on current filters and preferences');
  };
  const handleBrandFilterChange = useCallback((newFilters) => {
    handleFilterChange(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  }, [handleFilterChange]);

  useEffect(() => {
    console.log('Component state:', {
      batteriesCount: batteries.length,
      hasMore,
      totalCount,
      filters
    });
  }, [batteries, hasMore, totalCount, filters]);

  return (
    <Container fluid className="my-4">
      {selectedBatteries.length > 0 && (
        <ComparisonSection
          selectedBatteries={selectedBatteries}
          onClearSelection={clearSelection}
          onRemoveBattery={handleRemoveBattery}
        />
      )}
      <br /><br />
      <h1 className="text-center mb-4">Battery Comparison</h1>
      <Row>
        <Col md={3}>
          <BatteryFilters
            sortBy={sortBy}
            setSortBy={handleSortChange}
            searchTerm={searchTerm}
            setSearchTerm={handleSearchChange}
            allBrands={allBrands}
            showOnlyBrands={true}
            onSuggestBattery={handleSuggestBattery}
            onFilterChange={handleBrandFilterChange}
          />
        </Col>
        <Col md={9}>
          <Row>
            <Col xs={12}>
              <BatteryFilters
                sortBy={sortBy}
                setSortBy={handleSortChange}
                searchTerm={searchTerm}
                setSearchTerm={handleSearchChange}
                allBrands={allBrands}
                showOnlyBrands={false}
                onSuggestBattery={handleSuggestBattery}
                onFilterChange={handleBrandFilterChange}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <BatteryGrid
                batteries={batteries}
                loading={loading}
                error={error}
                onSelectBattery={handleSelectBattery}
                selectedBatteries={selectedBatteries}
                // onReportIssue={handleReportIssue}
                // onViewDetails={handleViewDetails}
              />
               {hasMore ? (
                  <div className="text-center mt-3">
                    <Button onClick={loadMore} disabled={loading}>
                      {loading ? 'Loading...' : 'Load More'}
                    </Button>
                  </div>
                ) : (
                  batteries.length > 0 && (
                    <div className="text-center mt-3">
                      <p>All batteries loaded. Total: {totalCount}</p>
                    </div>
                  )
                )}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default BatteryComparison;