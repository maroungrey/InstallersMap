import React, { useState } from 'react';
import { Row, Col, Table, Button, Form } from 'react-bootstrap';
import { FaBatteryFull, FaBolt, FaFlask, FaWeight, FaCalendarAlt, FaBluetooth, FaThermometerHalf, FaShieldAlt, FaRedo, FaTimes, FaChartBar } from 'react-icons/fa';
import { ComparisonCharts } from './ComparisonCharts';

export const ComparisonSection = ({ selectedBatteries, onClearSelection, onRemoveBattery }) => {
  const [showCharts, setShowCharts] = useState(false);
  const [selectedChartOptions, setSelectedChartOptions] = useState([]);

  const features = [
    { key: 'Ah Capacity', label: 'Capacity', unit: 'Ah', icon: <FaBatteryFull /> },
    { key: 'Nominal V', label: 'Voltage', unit: 'V', icon: <FaBolt /> },
    { key: 'Chemistry', label: 'Chemistry', unit: '', icon: <FaFlask /> },
    { key: 'Weight(lbs)', label: 'Weight', unit: 'lbs', icon: <FaWeight /> },
    { key: 'Full Warranty Years', label: 'Warranty', unit: 'years', icon: <FaCalendarAlt /> },
    { key: 'Total kWh', label: 'Total kWh', unit: 'kWh', icon: <FaBatteryFull /> },
    { key: 'Bluetooth', label: 'Bluetooth', unit: '', icon: <FaBluetooth /> },
    { key: 'Self-Heating', label: 'Self-Heating', unit: '', icon: <FaThermometerHalf /> },
    { key: 'Protection Rating', label: 'Protection Rating', unit: '', icon: <FaShieldAlt /> },
    { key: 'Cycles', label: 'Cycles', unit: '', icon: <FaRedo /> },
  ];

  const chartOptions = [
    { value: 'capacityComparison', label: 'Capacity Comparison' },
    { value: 'weightVsCapacity', label: 'Weight vs. Capacity' },
    { value: 'warrantyComparison', label: 'Warranty Comparison' },
    { value: 'cycleLifeComparison', label: 'Cycle Life Comparison' },
    { value: 'energyDensity', label: 'Energy Density (Wh/kg)' },
    { value: 'chargingEfficiency', label: 'Charging Efficiency' },
    { value: 'temperaturePerformance', label: 'Temperature Performance' },
    { value: 'selfDischargeRate', label: 'Self-Discharge Rate' },
    { value: 'depthOfDischarge', label: 'Depth of Discharge' },
    { value: 'peakPowerOutput', label: 'Peak Power Output' },
  ];

  const handleChartOptionChange = (event) => {
    const value = event.target.value;
    setSelectedChartOptions(prevOptions => 
      prevOptions.includes(value)
        ? prevOptions.filter(option => option !== value)
        : [...prevOptions, value]
    );
  };

  const handleGenerateCharts = () => {
    setShowCharts(true);
  };

  return (
    <Row className="mt-5">
      <Col xs={12}>
        <h2>Battery Comparison</h2>
        <Table striped bordered hover responsive className="mb-4">
          <thead>
            <tr>
              <th>Brand - Model</th>
              {features.map(feature => (
                <th key={feature.key} title={feature.label}>
                  {feature.icon} {feature.label.length > 10 ? `${feature.label.slice(0, 10)}...` : feature.label}
                </th>
              ))}
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {selectedBatteries.map(battery => (
              <tr key={battery.id}>
                <td>{battery.Brand} - {battery.Name}</td>
                {features.map(feature => (
                  <td key={feature.key}>
                    {battery[feature.key]} {feature.unit}
                  </td>
                ))}
                <td>
                  <Button variant="outline-danger" size="sm" onClick={() => onRemoveBattery(battery.id)}>
                    <FaTimes />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
      
      <Col xs={12} className="mb-4">
        <h3>Select Comparison Charts</h3>
        <Form>
          <Row>
            {chartOptions.map(option => (
              <Col xs={12} sm={6} md={4} lg={3} key={option.value}>
                <Form.Check
                  type="checkbox"
                  id={`chart-${option.value}`}
                  label={option.label}
                  checked={selectedChartOptions.includes(option.value)}
                  onChange={handleChartOptionChange}
                  className="mb-2"
                />
              </Col>
            ))}
          </Row>
        </Form>
        <Button 
          variant="primary" 
          onClick={handleGenerateCharts} 
          disabled={selectedChartOptions.length === 0}
          className="mt-3"
        >
          <FaChartBar className="me-2" />
          Generate Selected Charts
        </Button>
      </Col>

      {showCharts && (
        <ComparisonCharts 
          selectedBatteries={selectedBatteries}
          selectedChartOptions={selectedChartOptions}
        />
      )}

      <Col xs={12} className="mt-4">
        <Button variant="primary" onClick={() => {/* Implement export logic */}}>Export Comparison</Button>{' '}
        <Button variant="secondary" onClick={() => {/* Implement save favorites logic */}}>Save Favorites</Button>{' '}
        <Button variant="danger" onClick={onClearSelection}>Clear Selection</Button>
      </Col>
    </Row>
  );
};