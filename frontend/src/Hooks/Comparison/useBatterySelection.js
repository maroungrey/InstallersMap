import { useState } from 'react';

export const useBatterySelection = () => {
  const [selectedBatteries, setSelectedBatteries] = useState([]);

  const handleSelectBattery = (battery) => {
    setSelectedBatteries((prev) =>
      prev.find((b) => b.id === battery.id)
        ? prev.filter((b) => b.id !== battery.id)
        : [...prev, battery]
    );
  };

  const handleRemoveBattery = (batteryId) => {
    setSelectedBatteries((prev) => prev.filter((b) => b.id !== batteryId));
  };

  return {
    selectedBatteries,
    handleSelectBattery,
    handleRemoveBattery,
    clearSelection: () => setSelectedBatteries([]),
  };
};
