package gieraga.vinylove.controller;

import gieraga.vinylove.dto.LoginResponseDto;
import gieraga.vinylove.dto.LoginUserDto;
import gieraga.vinylove.dto.RegisterUserDto;
import gieraga.vinylove.model.User;
import gieraga.vinylove.service.AuthService;
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

    /**
     * Endpoint do rejestracji nowego użytkownika.
     * @param registerUserDto Dane nowego użytkownika (nazwa, email, hasło).
     * @return Zwraca utworzonego użytkownika z kodem statusu 201 (Created).
     */
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterUserDto registerUserDto) {
        User registeredUser = authService.registerUser(registerUserDto);
        return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
    }

    /**
     * Endpoint do logowania użytkownika.
     * @param loginUserDto Dane logowania (nazwa użytkownika, hasło).
     * @return Zwraca odpowiedź z tokenem JWT i danymi użytkownika z kodem statusu 200 (OK).
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginUserDto loginUserDto) {
        LoginResponseDto loginResponse = authService.loginUser(loginUserDto);
        return ResponseEntity.ok(loginResponse);
    }
}