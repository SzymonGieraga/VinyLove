package gieraga.vinylove.controller;

import gieraga.vinylove.dto.CreateReviewDto;
import gieraga.vinylove.dto.ReviewDto;
import gieraga.vinylove.model.RecordReview;
import gieraga.vinylove.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offers/{offerId}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public ResponseEntity<List<ReviewDto>> getReviews(@PathVariable Long offerId) {
        return ResponseEntity.ok(reviewService.getReviewsForOffer(offerId));
    }

    @PostMapping
    public ResponseEntity<RecordReview> addReview(@PathVariable Long offerId, @Valid @RequestBody CreateReviewDto dto) {
        RecordReview newReview = reviewService.createReview(offerId, dto);
        return new ResponseEntity<>(newReview, HttpStatus.CREATED);
    }
}