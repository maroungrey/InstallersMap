import axios from 'axios';
import { debounce } from 'lodash'; // You might need to install lodash

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';

const debouncedFetch = debounce((params, callback) => {
  axios.get(`${API_BASE_URL}/batteries`, { params })
    .then(response => callback(null, response))
    .catch(error => callback(error));
}, 300);

export const fetchBatteries = async ({
  brands = [],
  voltage = '',
  chemistry = '',
  sortBy = '',
  searchTerm = '',
  page = 1,
  limit = 12
}) => {
  return new Promise((resolve, reject) => {
    const params = {
      brands: brands.join(','),
      voltage,
      chemistry,
      sortBy,
      searchTerm,
      page,
      limit
    };

    debouncedFetch(params, (error, response) => {
      if (error) {
        console.error('Error fetching batteries:', error);
        reject(error);
      } else {
        resolve({
          data: response.data.batteries || [],
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalCount: response.data.totalCount,
          allBrands: response.data.allBrands || [],
          hasMore: response.data.currentPage < response.data.totalPages
        });
      }
    });
  });
};