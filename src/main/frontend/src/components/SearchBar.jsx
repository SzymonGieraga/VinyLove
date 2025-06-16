import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    useEffect(() => {
        // Ustaw timer, aby uruchomić wyszukiwanie 500ms po ostatnim wpisaniu znaku
        const timerId = setTimeout(() => {
            // Uruchom wyszukiwanie tylko, jeśli fraza jest pusta (reset) lub ma co najmniej 3 znaki
            if (query.length === 0 || query.length >= 3) {
                onSearch(query);
            }
        }, 500); // 500ms opóźnienia

        // Wyczyść timer, jeśli użytkownik wpisuje kolejne znaki, aby uniknąć niepotrzebnych zapytań
        return () => {
            clearTimeout(timerId);
        };
    }, [query, onSearch]); // Efekt uruchamia się ponownie, gdy zmieni się 'query'

    const handleClear = () => {
        setQuery('');
        // onSearch('') zostanie wywołane automatycznie przez useEffect po wyczyszczeniu stanu
    };

    // Usunęliśmy formularz, ponieważ wyszukiwanie jest teraz automatyczne
    return (
        <div className="search-bar">
            <div className="search-input-wrapper">
                <input
                    type="text"
                    className="search-input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Szukaj po tytule, artyście lub właścicielu (min. 3 znaki)..."
                />
                {/* Przycisk czyszczenia pojawia się tylko, gdy coś jest wpisane */}
                {query && (
                    <button type="button" className="clear-button" onClick={handleClear}>
                        &times;
                    </button>
                )}
            </div>
            {/* Przycisk "Szukaj" nie jest już potrzebny */}
        </div>
    );
};

export default SearchBar;