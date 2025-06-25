import React, { useState, useEffect, useCallback } from 'react';
import rewardCodeService from '../services/rewardCodeService';

const RewardCodesTab = () => {
    const [codes, setCodes] = useState([]);
    const [availableGenerations, setAvailableGenerations] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = useCallback(() => {
        setLoading(true);
        Promise.all([
            rewardCodeService.getMyCodes(),
            rewardCodeService.getStatus()
        ]).then(([codesResponse, statusResponse]) => {
            setCodes(codesResponse.data);
            setAvailableGenerations(statusResponse.data.availableGenerations);
        }).catch(err => {
            console.error(err);
            setError("Nie udało się załadować danych o kodach.");
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleGenerateCode = () => {
        setError('');
        rewardCodeService.generateCode()
            .then(() => {
                alert("Gratulacje! Wylosowałeś nowy kod rabatowy!");
                fetchData(); // Odśwież dane
            })
            .catch(err => setError(err.response?.data?.message || "Nie udało się wygenerować kodu."));
    };

    const handleUseCode = (codeId) => {
        rewardCodeService.useCode(codeId)
            .then(() => {
                alert("Kod został oznaczony jako zużyty.");
                fetchData();
            })
            .catch(err => alert(err.response?.data?.message || "Nie udało się zużyć kodu."));
    };

    if (loading) return <p>Ładowanie...</p>;

    return (
        <div className="reward-codes-container">
            <div className="generator-section">
                <h3>Generator Kodów Rabatowych</h3>
                <p>Za każde 10 wypożyczonych płyt otrzymujesz jedno losowanie. Powodzenia!</p>
                <p>Dostępne losowania: <strong>{availableGenerations}</strong></p>
                <button className="button is-primary" onClick={handleGenerateCode} disabled={availableGenerations <= 0}>
                    Losuj kod!
                </button>
                {error && <p className="alert alert-danger" style={{marginTop: '1rem'}}>{error}</p>}
            </div>

            <div className="codes-list-section">
                <h3>Twoje Kody</h3>
                {codes.length === 0 ? (
                    <p>Nie posiadasz jeszcze żadnych kodów.</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>Kod</th>
                            <th>Zniżka</th>
                            <th>Data wylosowania</th>
                            <th>Status</th>
                            <th>Akcja</th>
                        </tr>
                        </thead>
                        <tbody>
                        {codes.map(code => (
                            <tr key={code.id} className={code.isUsed ? 'is-used' : ''}>
                                <td><strong>{code.code}</strong></td>
                                <td>{code.discountPercentage}%</td>
                                <td>{new Date(code.createdAt).toLocaleDateString()}</td>
                                <td>
                                        <span className={`status-badge ${code.isUsed ? 'status-archived' : 'status-available'}`}>
                                            {code.isUsed ? 'Zużyty' : 'Aktywny'}
                                        </span>
                                </td>
                                <td>
                                    <button className="button is-small" onClick={() => handleUseCode(code.id)} disabled={code.isUsed}>
                                        Zużyj
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default RewardCodesTab;
