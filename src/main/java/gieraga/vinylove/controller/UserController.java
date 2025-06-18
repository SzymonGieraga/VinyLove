package gieraga.vinylove.controller;

import gieraga.vinylove.dto.SimpleReviewDto;
import gieraga.vinylove.dto.UserProfileDto;
import gieraga.vinylove.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{username}/profile")
    public ResponseEntity<UserProfileDto> getProfile(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserProfile(username));
    }

    @GetMapping("/{username}/reviews")
    public ResponseEntity<Page<SimpleReviewDto>> getProfileReviews(
            @PathVariable String username,
            @RequestParam String viewMode,
            @RequestParam(defaultValue = "ALL") String reviewType,
            @PageableDefault(size = 6, sort = "createdAt") Pageable pageable) {

        return ResponseEntity.ok(userService.getReviewsForProfile(username, viewMode, reviewType, pageable));
    }
}