package gieraga.vinylove.controller;

import gieraga.vinylove.dto.CreateReviewDto;
import gieraga.vinylove.dto.CreateUserReviewDto;
import gieraga.vinylove.dto.ReviewDto;
import gieraga.vinylove.model.RecordReview;
import gieraga.vinylove.model.UserReview;
import gieraga.vinylove.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api") // Ustawiamy jeden, wspólny prefiks dla całego API
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // --- Endpointy dla recenzji ofert ---
    @GetMapping("/offers/{offerId}/reviews")
    public ResponseEntity<List<ReviewDto>> getReviewsForOffer(@PathVariable Long offerId) {
        return ResponseEntity.ok(reviewService.getReviewsForOffer(offerId));
    }

    @PostMapping("/offers/{offerId}/reviews")
    public ResponseEntity<RecordReview> addReviewForOffer(@PathVariable Long offerId, @Valid @RequestBody CreateReviewDto dto) {
        RecordReview newReview = reviewService.createReview(offerId, dto);
        return new ResponseEntity<>(newReview, HttpStatus.CREATED);
    }

    // --- Endpoint dla recenzji użytkowników ---
    @PostMapping("/users/{username}/reviews")
    public ResponseEntity<UserReview> addUserReview(@PathVariable String username, @Valid @RequestBody CreateUserReviewDto dto) {
        UserReview newReview = reviewService.createUserReview(username, dto);
        return new ResponseEntity<>(newReview, HttpStatus.CREATED);
    }

    @DeleteMapping("/reviews/record/{id}")
    public ResponseEntity<Void> deleteRecordReview(@PathVariable Long id) {
        reviewService.deleteRecordReview(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/reviews/user/{id}")
    public ResponseEntity<Void> deleteUserReview(@PathVariable Long id) {
        reviewService.deleteUserReview(id);
        return ResponseEntity.noContent().build();
    }
}