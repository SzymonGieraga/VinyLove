package gieraga.vinylove.service;

import gieraga.vinylove.dto.CreateReviewDto;
import gieraga.vinylove.dto.ReviewDto;
import gieraga.vinylove.model.*;
import gieraga.vinylove.repo.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import gieraga.vinylove.dto.SimpleReviewDto;
import gieraga.vinylove.dto.CreateUserReviewDto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final RecordReviewRepo reviewRepo;
    private final RecordOfferRepo offerRepo;
    private final RentalRepo rentalRepo;
    private final AuthService authService;
    private final UserRepo userRepo;
    private final UserReviewRepo userReviewRepo;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public List<ReviewDto> getReviewsForOffer(Long offerId) {
        List<RecordReview> reviews = reviewRepo.findByRecordOfferIdOrderByCreatedAtDesc(offerId);
        return reviews.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public ReviewDto createReview(Long offerId, CreateReviewDto dto) {
        User author = authService.getAuthenticatedUser();
        RecordOffer offer = offerRepo.findById(offerId)
                .orElseThrow(() -> new EntityNotFoundException("Offer not found"));

        RecordReview review = new RecordReview();
        review.setAuthor(author);
        review.setRecordOffer(offer);
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        review.setCreatedAt(LocalDateTime.now());

        RecordReview savedReview = reviewRepo.save(review);

        User owner = offer.getOwner();
        if (!owner.equals(savedReview.getAuthor())) {
            String message = "Otrzymałeś nową recenzję dla oferty '" + offer.getTitle() + "' od " + savedReview.getAuthor().getUsername() + ".";
            notificationService.createNotification(owner, message, NotificationType.OFFER_REVIEW, offer.getId()); // <-- ZMIANA
        }

        return mapToDto(savedReview);
    }

    private ReviewDto mapToDto(RecordReview review) {
        ReviewDto dto = new ReviewDto();
        dto.setAuthorUsername(review.getAuthor().getUsername());
        dto.setAuthorProfileImageUrl(review.getAuthor().getProfileImageUrl());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        boolean hasRented = rentalRepo.existsByRenterAndRecordOffer(review.getAuthor(), review.getRecordOffer());
        dto.setHasRented(hasRented);

        return dto;
    }

    @Transactional
    public SimpleReviewDto createUserReview(String reviewedUsername, CreateUserReviewDto dto) {
        User reviewer = authService.getAuthenticatedUser();
        User reviewedUser = userRepo.findByUsername(reviewedUsername)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (reviewer.equals(reviewedUser)) {
            throw new IllegalStateException("Nie możesz ocenić samego siebie.");
        }

        UserReview review = new UserReview();
        review.setReviewer(reviewer);
        review.setReviewedUser(reviewedUser);
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());

        UserReview savedReview = userReviewRepo.save(review);



        String message = "Użytkownik " + savedReview.getReviewer().getUsername() + " wystawił Ci recenzję.";
        notificationService.createNotification(reviewedUser, message, NotificationType.USER_REVIEW, reviewedUser.getId());

        return mapToSimpleDto(savedReview);
    }

    private SimpleReviewDto mapToSimpleDto(UserReview review) {
        SimpleReviewDto dto = new SimpleReviewDto();
        dto.setId(review.getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        dto.setReviewType("USER");
        dto.setReviewerUsername(review.getReviewer().getUsername());
        User reviewedUser = review.getReviewedUser();
        dto.setSubjectId(reviewedUser.getId());
        dto.setSubjectName(reviewedUser.getUsername());
        dto.setSubjectImageUrl(reviewedUser.getProfileImageUrl());
        return dto;
    }

    @Transactional
    public void deleteRecordReview(Long reviewId) {
        User currentUser = authService.getAuthenticatedUser();
        RecordReview review = reviewRepo.findById(reviewId)
                .orElseThrow(() -> new EntityNotFoundException("Recenzja nie istnieje."));

        if (!review.getAuthor().equals(currentUser) && currentUser.getRole() != UserRole.ROLE_ADMIN) {
            throw new AccessDeniedException("Nie masz uprawnień do usunięcia tej recenzji.");
        }
        reviewRepo.delete(review);
    }

    @Transactional
    public void deleteUserReview(Long reviewId) {
        User currentUser = authService.getAuthenticatedUser();
        UserReview review = userReviewRepo.findById(reviewId)
                .orElseThrow(() -> new EntityNotFoundException("Recenzja nie istnieje."));

        if (!review.getReviewer().equals(currentUser) && currentUser.getRole() != UserRole.ROLE_ADMIN) {
            throw new AccessDeniedException("Nie masz uprawnień do usunięcia tej recenzji.");
        }
        userReviewRepo.delete(review);
    }
}