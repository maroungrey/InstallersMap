import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';

export const fetchBatteries = async ({
  brands = [],
  voltage = '',
  chemistry = '',
  sortBy = '',
  searchTerm = '',
  page = 1,
  limit = 12
}) => {
  try {
    const params = {
      brands: brands.join(','),
      voltage,
      chemistry,
      sortBy,
      searchTerm,
      page,
      limit
    };

    const response = await axios.get(`${API_BASE_URL}/batteries`, { params });

    return {
      data: response.data.batteries || [],
      allBrands: response.data.allBrands || [],
      hasMore: response.data.currentPage < response.data.totalPages,
      totalCount: response.data.totalCount,
    };
  } catch (error) {
    console.error('Error fetching batteries:', error);
    throw error;
  }
};