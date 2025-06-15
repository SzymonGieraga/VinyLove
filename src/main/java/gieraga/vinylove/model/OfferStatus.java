package gieraga.vinylove.model;

public enum OfferStatus {
    AVAILABLE, // Dostępna do wypożyczenia
    RENTED,    // Aktualnie wypożyczona
    HIDDEN,    // Ukryta przez właściciela, niewidoczna w wyszukiwaniach
    ARCHIVED   // Usunięta przez właściciela, ale wciąż widoczna w historii wypożyczeń innych
}