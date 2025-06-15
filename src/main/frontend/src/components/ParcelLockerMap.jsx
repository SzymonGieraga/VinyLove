import React, { useEffect, useRef } from 'react';

const mockParcelLockers = [
    { id: 'LOD01A', name: 'Paczkomat LOD01A', lat: 51.759247, lng: 19.455982, address: 'al. Politechniki 1, 90-924 Łódź' },
    { id: 'LOD02B', name: 'Paczkomat LOD02B', lat: 51.768611, lng: 19.456944, address: 'ul. Piotrkowska 104, 90-004 Łódź' },
    { id: 'LOD03C', name: 'Paczkomat LOD03C', lat: 51.77656, lng: 19.46786, address: 'ul. Zachodnia 56, 91-057 Łódź' },
    { id: 'LOD04D', name: 'Paczkomat LOD04D', lat: 51.7471, lng: 19.4899, address: 'ul. Rzgowska 58, 93-172 Łódź' }
];

const ParcelLockerMap = ({ onSelectLocker }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);

    useEffect(() => {
        if (mapRef.current && !mapInstance.current) {
            const L = window.L;

            mapInstance.current = L.map(mapRef.current).setView([51.759, 19.456], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapInstance.current);

            mockParcelLockers.forEach(locker => {
                const marker = L.marker([locker.lat, locker.lng]).addTo(mapInstance.current);
                marker.bindPopup(`<b>${locker.name}</b><br>${locker.address}`);
                marker.on('click', () => {
                    onSelectLocker(`${locker.name}, ${locker.address}`);
                });
            });
        }
    }, [onSelectLocker]);

    return <div ref={mapRef} id="map" style={{ height: '400px', width: '100%', borderRadius: '8px' }}></div>;
};

export default ParcelLockerMap;