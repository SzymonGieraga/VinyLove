import React, { useState } from 'react';
import OfferList from './OfferList';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

const Home = ({ user }) => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="container">
            <header className="jumbotron">
                <h3>{user ? `Witaj w Vinylove, ${user.username}!` : 'Witaj w Vinylove!'}</h3>
                <p>
                    {user
                        ? 'Możesz teraz dodawać własne oferty i wypożyczać płyty od innych.'
                        : 'Przeglądaj naszą kolekcję płyt. Zaloguj się, aby uzyskać pełną funkcjonalność.'}
                </p>
                {user && (
                    <Link to="/add-offer" className="button is-primary" style={{marginTop: '1rem'}}>
                        Dodaj nową ofertę
                    </Link>
                )}
            </header>

            <div className="offers-section">
                <h2 style={{textAlign: 'center', marginBottom: '1rem'}}>Najnowsze Oferty</h2>
                <SearchBar onSearch={(query) => setSearchTerm(query)} />
                <OfferList searchTerm={searchTerm} />
            </div>
        </div>
    );
};

export default Home;
