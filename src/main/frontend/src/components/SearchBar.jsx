import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    useEffect(() => {
        const timerId = setTimeout(() => {
            if (query.length === 0 || query.length >= 3) {
                onSearch(query);
            }
        }, 500);

        return () => {
            clearTimeout(timerId);
        };
    }, [query, onSearch]);

    const handleClear = () => {
        setQuery('');
    };

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
                {query && (
                    <button type="button" className="clear-button" onClick={handleClear}>
                        &times;
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchBar;