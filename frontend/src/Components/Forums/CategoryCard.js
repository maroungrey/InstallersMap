import React from 'react';
import { Card } from 'react-bootstrap';

const CategoryCard = ({ category, isSelected, onSelect }) => {
  return (
    <Card 
      className={`h-100 cursor-pointer ${isSelected ? 'border-primary' : ''}`}
      onClick={onSelect}
      style={{ cursor: 'pointer' }}
    >
      <Card.Body>
        <div className="d-flex align-items-center mb-2">
          {category.icon}
          <h5 className="mb-0 ms-2">{category.name}</h5>
        </div>
        <Card.Text className="text-muted">
          {category.description}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default CategoryCard;