import React from 'react';
import { Marker, useMap } from "react-leaflet";
import L from 'leaflet';

const createClusterIcon = function (count) {
  const size = Math.min(80, Math.max(40, 20 + count * 2)); // Min 40px, max 80px
  
  return L.divIcon({
    html: `<div style="width: ${size}px; height: ${size}px; display: flex; justify-content: center; align-items: center; background-color: #1D6BF399; border-radius: 50%; color: white; font-weight: bold;">
             <span>${count}</span>
           </div>`,
    className: 'custom-marker-cluster',
    iconSize: L.point(size, size, true),
  });
};

export const ClusterMarker = React.memo(({ cluster }) => {
  const map = useMap();
  
  const handleClick = () => {
    map.setView([cluster.lat, cluster.lng], map.getZoom() + 2, { animate: true, duration: 0.5 });
  };

  return (
    <Marker 
      position={[cluster.lat, cluster.lng]}
      icon={createClusterIcon(cluster.count)}
      eventHandlers={{ click: handleClick }}
    />
  );
});