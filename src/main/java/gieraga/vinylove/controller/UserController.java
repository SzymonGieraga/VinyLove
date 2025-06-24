package gieraga.vinylove.controller;

import gieraga.vinylove.dto.*; // Zmieniono na wildcard dla czystości
import gieraga.vinylove.service.RentalService;
import gieraga.vinylove.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final RentalService rentalService;

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

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(
            @RequestPart(value = "description", required = false) String description,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage
    ) {
        UserDto updatedUserDto = userService.updateUserProfile(description, profileImage);
        return ResponseEntity.ok(updatedUserDto);
    }

    @GetMapping("/{username}/rentals")
    public ResponseEntity<Page<RentalDto>> getProfileRentals(
            @PathVariable String username,
            @RequestParam String viewMode, // "rentedBy" or "ownedBy"
            @PageableDefault(size = 5) Pageable pageable) {

        return ResponseEntity.ok(rentalService.getRentalsForProfile(username, viewMode, pageable));
    }

    @GetMapping("/my-addresses")
    public ResponseEntity<List<AddressDto>> getMyAddresses() {
        return ResponseEntity.ok(userService.getAddressesForCurrentUser());
    }
}
