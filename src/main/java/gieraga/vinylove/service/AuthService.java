package gieraga.vinylove.service;

import gieraga.vinylove.dto.LoginResponseDto;
import gieraga.vinylove.dto.LoginUserDto;
import gieraga.vinylove.dto.RegisterUserDto;
import gieraga.vinylove.model.User;
import gieraga.vinylove.model.UserRole;
import gieraga.vinylove.repo.UserRepo;
import gieraga.vinylove.token.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
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

    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepo.findByUsername(username).orElse(null);
    }

    public User registerUser(RegisterUserDto registerUserDto) {
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
        return userRepo.save(user);
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
}