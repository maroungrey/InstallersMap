import React from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';

function TableSelector({ tables, selectedTable, onTableSelect }) {
  return (
    <ButtonGroup className="d-flex flex-wrap justify-content-center">
      {tables.map(table => (
        <Button
          key={table}
          variant={selectedTable === table ? 'primary' : 'outline-primary'}
          onClick={() => onTableSelect(table)}
          className="m-1"
        >
          {table}
        </Button>
      ))}
    </ButtonGroup>
  );
}

export default TableSelector;