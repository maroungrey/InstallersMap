import { useMemo } from 'react';

export const useSearch = (batteries, searchTerm) => {
  return useMemo(() => {
    if (!searchTerm) return batteries;
    return batteries.filter(battery => 
      Object.values(battery).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [batteries, searchTerm]);
};