package gieraga.vinylove.controller;

import gieraga.vinylove.dto.UserProfileDto;
import gieraga.vinylove.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{username}/profile")
    public ResponseEntity<UserProfileDto> getProfile(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserProfile(username));
    }
}