import { useState, useCallback } from 'react';

function useBusinessSelection(businesses) {
  const [selectedBusinessIndex, setSelectedBusinessIndex] = useState(null);

  const handleBusinessClick = useCallback((index) => {
    setSelectedBusinessIndex(index);
  }, []);

  const handleMarkerClick = useCallback((businessId) => {
    const index = businesses.findIndex(b => b.id === businessId);
    setSelectedBusinessIndex(index);
  }, [businesses]);

  return { selectedBusinessIndex, handleBusinessClick, handleMarkerClick };
}

export default useBusinessSelection;