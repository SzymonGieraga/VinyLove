package gieraga.vinylove.config;

import gieraga.vinylove.model.User;
import gieraga.vinylove.model.UserRole;
import gieraga.vinylove.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class AdminUserInitializer implements CommandLineRunner {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepo.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@vinylove.com");
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setRole(UserRole.ROLE_ADMIN);
            admin.setActive(true);
            admin.setBalance(new BigDecimal("9999.00"));
            admin.setDescription("Główny administrator systemu Vinylove.");

            userRepo.save(admin);
            System.out.println(">>> Utworzono domyślne konto administratora (login: admin, hasło: admin) <<<");
        }
        System.out.println(">>> KONTO ADMIN: (login: admin, hasło: admin) <<<");
    }
}
