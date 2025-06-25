package gieraga.vinylove.service;

import gieraga.vinylove.model.Rental;
import gieraga.vinylove.model.RentalStatus;
import gieraga.vinylove.repo.RentalRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import gieraga.vinylove.model.NotificationType;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RentalNotificationScheduler {

    private final RentalRepo rentalRepo;
    private final NotificationService notificationService;
    private static final int REMINDER_DAYS_BEFORE_END = 2;

    @Scheduled(cron = "0 0 11 * * ?")
    @Transactional
    public void sendRentalEndingSoonReminders() {
        log.info("Uruchamianie zadania sprawdzającego kończące się wypożyczenia...");

        LocalDate reminderDate = LocalDate.now().plusDays(REMINDER_DAYS_BEFORE_END);

        List<Rental> rentalsEndingSoon = rentalRepo.findByStatusAndReturnDateAndReminderSentIsFalse(
                RentalStatus.DELIVERED,
                reminderDate
        );

        if (rentalsEndingSoon.isEmpty()) {
            log.info("Nie znaleziono wypożyczeń kończących się dnia {}. Zakończono zadanie.", reminderDate);
            return;
        }

        log.info("Znaleziono {} wypożyczeń do wysłania przypomnień.", rentalsEndingSoon.size());

        for (Rental rental : rentalsEndingSoon) {
            String message = "Przypomnienie: Okres wypożyczenia dla oferty '" +
                    rental.getRecordOffer().getTitle() +
                    "' kończy się za " + REMINDER_DAYS_BEFORE_END + " dni.";

            notificationService.createNotification(rental.getRenter(), message, NotificationType.RENTAL_REMINDER, rental.getRenter().getId());

            rental.setReminderSent(true);
            rentalRepo.save(rental);
        }

        log.info("Pomyślnie wysłano przypomnienia. Zakończono zadanie.");
    }
}