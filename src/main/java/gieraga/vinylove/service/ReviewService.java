package gieraga.vinylove.service;

import gieraga.vinylove.dto.CreateReviewDto;
import gieraga.vinylove.dto.ReviewDto;
import gieraga.vinylove.model.*;
import gieraga.vinylove.repo.RecordOfferRepo;
import gieraga.vinylove.repo.RecordReviewRepo;
import gieraga.vinylove.repo.RentalRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
}