package gieraga.vinylove.controller;

import gieraga.vinylove.dto.*;
import gieraga.vinylove.model.User;
import gieraga.vinylove.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody RegisterUserDto registerUserDto) {
        UserDto registeredUserDto = authService.registerUser(registerUserDto);
        return new ResponseEntity<>(registeredUserDto, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginUserDto loginUserDto) {
        LoginResponseDto loginResponse = authService.loginUser(loginUserDto);
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordDto changePasswordDto) {
        authService.changePassword(changePasswordDto);
        return ResponseEntity.ok().build();
    }
}