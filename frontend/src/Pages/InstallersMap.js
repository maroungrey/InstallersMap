import React from 'react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import BusinessMap from '../Components/Map/BusinessMap';
import Sidebar from '../Components/Map/Sidebar';
import TableSelector from '../Components/Map/TableSelector';
import useTableData from '../Hooks/Map/useTableData';
import useBusinessData from '../Hooks/Map/useBusinessData';
import useBusinessSelection from '../Hooks/Map/useBusinessSelection';

function InstallersMap() {
  const { tables, selectedTable, handleTableSelect, tableError } = useTableData();
  const { businesses, loading, error: businessError } = useBusinessData(selectedTable);
  const { selectedBusinessIndex, handleBusinessClick, handleMarkerClick } = useBusinessSelection(businesses);

  const error = tableError || businessError;

  return (
    <Container fluid className="p-3" style={{ height: '100vh' }}>
      {error && <Alert variant="danger">Error: {error}</Alert>}
      <Row className="h-75">
      <Col md={4} className="border-end h-100">
        {loading ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : (
          <Sidebar 
            businesses={businesses}
            onBusinessClick={handleBusinessClick}
            selectedBusinessIndex={selectedBusinessIndex}
          />
        )}
      </Col>
        <Col md={8} className="h-100">
          {businesses.length > 0 && (
            <BusinessMap
              businesses={businesses}
              onMarkerClick={handleMarkerClick}
            />
          )}
        </Col>
      </Row>
      <Row className="my-3">
        <Col>
          <TableSelector
            tables={tables}
            selectedTable={selectedTable}
            onTableSelect={handleTableSelect}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default InstallersMap;