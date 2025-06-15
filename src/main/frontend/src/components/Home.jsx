import React from 'react';
import OfferList from './OfferList';
import { Link } from 'react-router-dom';

const Home = ({ user }) => {
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
                <h2 style={{textAlign: 'center', marginBottom: '2rem'}}>Najnowsze Oferty</h2>
                <OfferList />
            </div>
        </div>
    );
};

export default Home;