import React, { useEffect, useRef, useState, useCallback } from 'react';
import parcelLockerService from '../services/parcelLockerService';

const ParcelLockerMap = ({ onSelectLocker, isAdmin = false }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const [lockers, setLockers] = useState([]);

    const fetchLockers = useCallback(() => {
        parcelLockerService.getLockers()
            .then(res => setLockers(res.data))
            .catch(err => console.error("Błąd pobierania paczkomatów:", err));
    }, []);

    useEffect(() => {
        fetchLockers();
    }, [fetchLockers]);

    useEffect(() => {
        const L = window.L;
        if (!L) return;

        if (mapRef.current && !mapInstance.current) {
            mapInstance.current = L.map(mapRef.current).setView([51.759, 19.456], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap'
            }).addTo(mapInstance.current);
        }

        const map = mapInstance.current;
        if (!map) return;

        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        lockers.forEach(locker => {
            const marker = L.marker([locker.lat, locker.lng]).addTo(map);
            marker.bindPopup(`<b>${locker.name}</b><br>${locker.address}`);
            marker.on('click', () => {
                if (onSelectLocker) {
                    onSelectLocker(`${locker.name}, ${locker.address}`);
                }
            });
        });

        if (isAdmin) {
            const handleMapClick = (e) => {
                const { lat, lng } = e.latlng;
                const name = prompt("Podaj nazwę nowego paczkomatu (np. LOD05E):");
                if (!name) return;

                const address = prompt("Podaj adres paczkomatu:");
                if (!address) return;

                const newLocker = { name, address, lat, lng };

                parcelLockerService.createLocker(newLocker)
                    .then(() => {
                        alert("Paczkomat został pomyślnie dodany!");
                        fetchLockers(); // Odśwież listę paczkomatów
                    })
                    .catch(err => alert("Błąd: " + err.response?.data?.message || "Nie udało się dodać paczkomatu."));
            };

            map.on('click', handleMapClick);

            return () => {
                map.off('click', handleMapClick);
            };
        }

    }, [lockers, isAdmin, onSelectLocker, fetchLockers]);

    return <div ref={mapRef} id="map" style={{ height: '400px', width: '100%', borderRadius: '8px' }}></div>;
};

export default ParcelLockerMap;