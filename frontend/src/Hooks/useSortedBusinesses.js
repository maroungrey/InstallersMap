import { useMemo } from 'react';
import { calculateDistance } from '../Utilities/calculateDistance';

export const useSortedBusinesses = (businesses, mapCenter) => {
  return useMemo(() => {
    if (!mapCenter) return businesses;

    const sorted = businesses.map(business => ({
      ...business,
      distance: calculateDistance(
        mapCenter.lat, 
        mapCenter.lng, 
        business.geocode[0], 
        business.geocode[1]
      )
    })).sort((a, b) => a.distance - b.distance);

    return sorted;
  }, [businesses, mapCenter]);
};
