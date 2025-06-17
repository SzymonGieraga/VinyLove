package gieraga.vinylove.service;

import gieraga.vinylove.dto.CreateReviewDto;
import gieraga.vinylove.dto.ReviewDto;
import gieraga.vinylove.model.*;
import gieraga.vinylove.repo.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import gieraga.vinylove.dto.CreateReviewDto;
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

    @Transactional(readOnly = true)
    public List<ReviewDto> getReviewsForOffer(Long offerId) {
        List<RecordReview> reviews = reviewRepo.findByRecordOfferIdOrderByCreatedAtDesc(offerId);
        return reviews.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public RecordReview createReview(Long offerId, CreateReviewDto dto) {
        User author = authService.getAuthenticatedUser();
        RecordOffer offer = offerRepo.findById(offerId)
                .orElseThrow(() -> new EntityNotFoundException("Offer not found"));

        RecordReview review = new RecordReview();
        review.setAuthor(author);
        review.setRecordOffer(offer);
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        review.setCreatedAt(LocalDateTime.now());

        return reviewRepo.save(review);
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
    public UserReview createUserReview(String reviewedUsername, CreateUserReviewDto dto) {
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

        return userReviewRepo.save(review);
    }

    public void deleteUserReview(Long reviewId) {
        userReviewRepo.deleteById(reviewId);
    }

    public void deleteRecordReview(Long reviewId) {
        reviewRepo.deleteById(reviewId);
    }
}