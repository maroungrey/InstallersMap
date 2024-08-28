import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';

function useTableData() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('golf-cart');
  const [error, setError] = useState(null);

  const fetchTables = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/installers/tables`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTables(data);
      if (data.length > 0 && !data.includes(selectedTable)) {
        setSelectedTable(data[0]);
      }
    } catch (err) {
      console.error('Error fetching tables:', err);
      setError('Failed to fetch available tables');
    }
  }, [selectedTable]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const handleTableSelect = useCallback((table) => {
    setSelectedTable(table);
  }, []);

  return { tables, selectedTable, handleTableSelect, error };
}

export default useTableData;