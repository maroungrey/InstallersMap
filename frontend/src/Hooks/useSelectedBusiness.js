import { useState } from 'react';

export const useSelectedBusiness = () => {
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showReportForm, setShowReportForm] = useState(false);

  const handleFlagClick = (business) => {
    setSelectedBusiness(business);
    setShowReportForm(true);
  };

  const handleCloseReportForm = () => {
    setShowReportForm(false);
    setSelectedBusiness(null);
  };

  return {
    selectedBusiness,
    showReportForm,
    handleFlagClick,
    handleCloseReportForm
  };
};
