package gieraga.vinylove.service;

import gieraga.vinylove.converter.UserConverter; // Upewnij się, że ten import istnieje
import gieraga.vinylove.dto.*;
import gieraga.vinylove.model.User;
import gieraga.vinylove.model.UserRole;
import gieraga.vinylove.repo.UserRepo;
import gieraga.vinylove.token.JwtService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepo userRepo;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final UserConverter userConverter;

    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return null;
        }
        String username = authentication.getName();
        return userRepo.findByUsername(username).orElse(null);
    }

    public UserDto registerUser(RegisterUserDto registerUserDto) {
        if (userRepo.findByUsername(registerUserDto.getUsername()).isPresent() || userRepo.findByEmail(registerUserDto.getEmail()).isPresent()) {
            throw new IllegalStateException("Username or email already taken");
        }

        User user = new User();
        user.setUsername(registerUserDto.getUsername());
        user.setEmail(registerUserDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerUserDto.getPassword()));
        user.setRole(UserRole.ROLE_USER);
        user.setBalance(new BigDecimal("100.00"));
        user.setActive(true);

        User savedUser = userRepo.save(user);

        return userConverter.toDto(savedUser);
    }

    public LoginResponseDto loginUser(LoginUserDto loginUserDto) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginUserDto.getUsername(), loginUserDto.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid username or password", e);
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(loginUserDto.getUsername());
        String jwt = jwtService.generateToken(userDetails);

        return new LoginResponseDto(
                loginUserDto.getUsername(),
                userDetails.getAuthorities().iterator().next().getAuthority(),
                "Bearer " + jwt);
    }
    @Transactional
    public void changePassword(ChangePasswordDto dto) {
        User user = getAuthenticatedUser();
        if (user == null) {
            throw new IllegalStateException("Użytkownik nie jest uwierzytelniony.");
        }

        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            throw new BadCredentialsException("Nieprawidłowe aktualne hasło.");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));

        userRepo.save(user);
    }

    public Optional<User> getOptionalAuthenticatedUser() {
        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return Optional.empty();
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            return userRepo.findByUsername(username);
        }
        return Optional.empty();
    }
}