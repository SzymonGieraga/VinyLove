package gieraga.vinylove.controller;

import gieraga.vinylove.dto.AdminOfferDto;
import gieraga.vinylove.dto.AdminRecordReviewDto;
import gieraga.vinylove.dto.AdminUserDto;
import gieraga.vinylove.dto.AdminUserReviewDto;
import gieraga.vinylove.model.User;
import gieraga.vinylove.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<Page<AdminUserDto>> getUsers(@PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(adminService.getAllUsers(pageable));
    }

    @PutMapping("/users/{userId}/toggle-status")
    public ResponseEntity<User> toggleUserStatus(@PathVariable Long userId) {
        User updatedUser = adminService.toggleUserStatus(userId);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/reviews/offers")
    public ResponseEntity<Page<AdminRecordReviewDto>> getRecordReviews(@PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(adminService.getAllRecordReviews(pageable));
    }

    @DeleteMapping("/reviews/offers/{reviewId}")
    public ResponseEntity<Void> deleteRecordReview(@PathVariable Long reviewId) {
        adminService.deleteRecordReview(reviewId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/reviews/users")
    public ResponseEntity<Page<AdminUserReviewDto>> getUserReviews(@PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(adminService.getAllUserReviews(pageable));
    }

    @DeleteMapping("/reviews/users/{reviewId}")
    public ResponseEntity<Void> deleteUserReview(@PathVariable Long reviewId) {
        adminService.deleteUserReview(reviewId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/offers")
    public ResponseEntity<Page<AdminOfferDto>> getAllOffers(@PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(adminService.getAllOffers(pageable));
    }
}