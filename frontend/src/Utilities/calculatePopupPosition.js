// utils/calculatePopupPosition.js
export const calculatePopupPosition = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX + rect.width / 2,
    };
  };
  