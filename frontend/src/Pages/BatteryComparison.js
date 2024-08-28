import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { BatteryFilters } from '../Components/Batteries/BatteryFilters';
import { BatteryGrid } from '../Components/Batteries/BatteryGrid';
import { ComparisonSection } from '../Components/Batteries/ComparisonSection';
import { BatteryDetailView } from '../Components/Batteries/BatteryDetailView';
import ReportForm from '../Components/Batteries/ReportForm';
import { useBatteryData } from '../Hooks/Comparison/useBatteryData';
import { useFilters } from '../Hooks/Comparison/useFilters';
import { useBatterySelection } from '../Hooks/Comparison/useBatterySelection';

const BatteryComparison = () => {
  const {
    filters,
    sortBy,
    searchTerm,
    handleFilterChange,
    handleSortChange,
    handleSearchChange,
  } = useFilters();

  const [selectedVoltage, setSelectedVoltage] = useState('All Voltages');
  const [selectedBrands, setSelectedBrands] = useState([]);

  const combinedFilters = useMemo(() => ({
    ...filters,
    voltage: selectedVoltage === 'All Voltages' ? '' : selectedVoltage,
    brands: selectedBrands
  }), [filters, selectedVoltage, selectedBrands]);

  const {
    batteries,
    allBrands,
    loading,
    error,
    hasMore,
    loadMore,
    totalCount
  } = useBatteryData(combinedFilters, sortBy, searchTerm);

  const {
    selectedBatteries,
    handleSelectBattery,
    handleRemoveBattery,
    clearSelection,
  } = useBatterySelection();

  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedBattery, setSelectedBattery] = useState(null);
  const [showReportForm, setShowReportForm] = useState(false);

  const handleSuggestBattery = useCallback(() => {
    console.log('Suggesting a battery based on current filters and preferences');
  }, []);

  const handleBrandFilterChange = useCallback((brands) => {
    console.log('Brand filter changed:', brands);
    setSelectedBrands(brands);
  }, []);

  const handleVoltageChange = useCallback((voltage) => {
    console.log('Voltage changed:', voltage);
    setSelectedVoltage(voltage);
  }, []);

  const handleViewDetails = useCallback((battery) => {
    setSelectedBattery(battery);
    setShowDetailView(true);
  }, []);

  const handleReportIssue = useCallback((battery) => {
    setSelectedBattery(battery);
    setShowReportForm(true);
  }, []);

  useEffect(() => {
    console.log('Combined filters:', combinedFilters);
  }, [combinedFilters]);

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
            selectedVoltage={selectedVoltage}
            setSelectedVoltage={handleVoltageChange}
            selectedBrands={selectedBrands}
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
                selectedVoltage={selectedVoltage}
                setSelectedVoltage={handleVoltageChange}
                selectedBrands={selectedBrands}
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
                onReportIssue={handleReportIssue}
                onViewDetails={handleViewDetails}
              />
               {hasMore && (
                  <div className="text-center mt-3">
                    <Button onClick={loadMore} disabled={loading}>
                      {loading ? 'Loading...' : 'Load More'}
                    </Button>
                  </div>
                )}
                {!hasMore && batteries.length > 0 && (
                  <div className="text-center mt-3">
                    <p>All batteries loaded. Total: {totalCount}</p>
                  </div>
                )}
            </Col>
          </Row>
        </Col>
      </Row>

      <BatteryDetailView
        show={showDetailView}
        onHide={() => setShowDetailView(false)}
        battery={selectedBattery}
      />

      <ReportForm
        show={showReportForm}
        onHide={() => setShowReportForm(false)}
        battery={selectedBattery}
      />
    </Container>
  );
};

export default BatteryComparison;