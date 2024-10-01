import { useState } from 'react';
import { calculatePopupPosition } from '../Utilities/calculatePopupPosition';

export const usePopupPosition = () => {
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  const handleMouseEnter = (event) => {
    setPopupPosition(calculatePopupPosition(event));
  };

  return {
    popupPosition,
    handleMouseEnter
  };
};
