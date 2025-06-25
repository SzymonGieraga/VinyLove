import React from 'react';

const FaqModal = ({ isOpen, onClose }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose}>&times;</button>

                <h2>Często Zadawane Pytania (F.A.Q.)</h2>

                <div className="faq-section">
                    <h4 className="faq-question">1. Do czego służy strona Vinylove?</h4>
                    <p className="faq-answer">
                        Vinylove to społecznościowa platforma dla miłośników płyt winylowych. Naszym celem jest umożliwienie pasjonatom muzyki dzielenia się swoimi kolekcjami poprzez wypożyczanie płyt. Możesz tutaj przeglądać unikalne oferty innych użytkowników, odkrywać nową muzykę i udostępniać własne winyle, aby inni mogli się nimi cieszyć.
                    </p>
                </div>

                <div className="faq-section">
                    <h4 className="faq-question">2. Dlaczego nie mogę nic zrobić na stronie?</h4>
                    <p className="faq-answer">
                        Większość interaktywnych funkcji, takich jak wypożyczanie płyt, dodawanie własnych ofert czy wystawianie recenzji, wymaga posiadania konta i bycia zalogowanym. Robimy to, aby zapewnić bezpieczeństwo transakcji, budować zaufanie w naszej społeczności i umożliwić komunikację między użytkownikami. Rejestracja jest darmowa i zajmuje tylko chwilę! Jako niezalogowany gość możesz swobodnie przeglądać wszystkie dostępne oferty.
                    </p>
                </div>

                <div className="faq-section">
                    <h4 className="faq-question">3. Jakie są zasady korzystania z serwisu?</h4>
                    <p className="faq-answer">
                        Aby zapewnić przyjazną i bezpieczną atmosferę, prosimy o przestrzeganie kilku podstawowych zasad:
                    </p>
                    <ul className="faq-list">
                        <li><b>Szanuj innych:</b> Bądź uprzejmy i kulturalny w komunikacji z innymi użytkownikami.</li>
                        <li><b>Dbaj o płyty:</b> Wypożyczone winyle traktuj z należytą starannością, tak jakby były Twoje własne.</li>
                        <li><b>Bądź uczciwy:</b> Opisując swoje oferty, podawaj prawdziwe informacje o stanie płyty i okładki.</li>
                        <li><b>Zwracaj na czas:</b> Przestrzegaj ustalonych terminów zwrotu, aby inni również mogli cieszyć się muzyką.</li>
                        <li><b>Przestrzegaj prawa:</b> Nie udostępniaj treści nielegalnych lub chronionych prawem autorskim w sposób do tego nieuprawniony.</li>
                    </ul>
                    <p className="faq-answer">
                        Naruszenie zasad może prowadzić do tymczasowego lub stałego zawieszenia konta.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default FaqModal;