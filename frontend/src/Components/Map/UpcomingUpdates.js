import React from 'react';
import { Row, Col } from 'react-bootstrap';

const UpcomingUpdates = () => {
  return (
    <Row>
      <Col>
        <br /><br />
        <h5>Upcoming updates:</h5>
        <ul>
          <li>Server-side optimization (server-side filtering, sorting, virtualized list / progressive loading, debounce map center update)</li>
          <li>Search clears itself after executing</li>
          <li>Add star businesses and rank them higher</li>
          <li>Add category filters and DB entries for them (marine, solar, industrial, etc.)</li>
          <li>Make the page mobile-friendly</li>
          <li>Automatically detect users' location and set map center to it</li>
          <li>Make "Report the business" form functional</li>
        </ul>
      </Col>
    </Row>
  );
};

export default UpcomingUpdates;