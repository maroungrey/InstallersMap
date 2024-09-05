// TableSelector.js
import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

const TableSelector = ({ currentTable, onTableChange }) => {
  return (
    <ButtonGroup className="mb-3 w-100">
      <Button 
        variant={currentTable === 'golf-cart' ? 'primary' : 'outline-primary'}
        onClick={() => onTableChange('golf-cart')}
      >
        Golf Cart Installers
      </Button>
      <Button 
        variant={currentTable === 'solar' ? 'primary' : 'outline-primary'}
        onClick={() => onTableChange('solar')}
      >
        Solar Installers
      </Button>
    </ButtonGroup>
  );
};

export default TableSelector;