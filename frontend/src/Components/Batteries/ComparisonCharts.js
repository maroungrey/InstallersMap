import React from 'react';
import { Col, Image } from 'react-bootstrap';

export const ComparisonCharts = ({ selectedBatteries, selectedChartOptions }) => {
  const renderChart = (chartType) => {
    // In a real implementation, you would generate actual charts here
    // For now, we're using placeholders
    return (
      <Col xs={12} md={6} className="mb-4">
        <h4>{getChartTitle(chartType)}</h4>
        <Image src={`https://placehold.co/600x400?text=${chartType}`} alt={`${chartType} Chart`} fluid />
      </Col>
    );
  };

  const getChartTitle = (chartType) => {
    const titles = {
      capacityComparison: 'Capacity Comparison',
      weightVsCapacity: 'Weight vs. Capacity',
      warrantyComparison: 'Warranty Comparison',
      cycleLifeComparison: 'Cycle Life Comparison',
      energyDensity: 'Energy Density (Wh/kg)',
      chargingEfficiency: 'Charging Efficiency',
      temperaturePerformance: 'Temperature Performance',
      selfDischargeRate: 'Self-Discharge Rate',
      depthOfDischarge: 'Depth of Discharge',
      peakPowerOutput: 'Peak Power Output',
    };
    return titles[chartType] || chartType;
  };

  return (
    <>
      <Col xs={12}>
        <h3 className="mb-4">Comparison Charts</h3>
      </Col>
      {selectedChartOptions.map(chartType => renderChart(chartType))}
    </>
  );
};