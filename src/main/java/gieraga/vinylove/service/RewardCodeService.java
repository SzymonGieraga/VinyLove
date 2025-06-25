package gieraga.vinylove.service;

import gieraga.vinylove.dto.RewardCodeDto;
import gieraga.vinylove.model.Rental;
import gieraga.vinylove.model.RewardCode;
import gieraga.vinylove.model.User;
import gieraga.vinylove.repo.RentalRepo;
import gieraga.vinylove.repo.RewardCodeRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RewardCodeService {

    private final AuthService authService;
    private final RentalRepo rentalRepo;
    private final RewardCodeRepo rewardCodeRepo;
    private final Random random = new Random();

    @Transactional(readOnly = true)
    public int countAvailableGenerations() {
        User currentUser = authService.getAuthenticatedUser();
        long rentalsCount = rentalRepo.countByRenter(currentUser);
        long usedCodesCount = rewardCodeRepo.countByUser(currentUser);
        long availableGenerations = (rentalsCount / 2) - usedCodesCount;
        return (int) Math.max(0, availableGenerations);
    }

    @Transactional
    public RewardCodeDto generateCode() {
        if (countAvailableGenerations() <= 0) {
            throw new IllegalStateException("Nie masz dostępnych losowań kodów rabatowych.");
        }
        User currentUser = authService.getAuthenticatedUser();

        int chance = random.nextInt(100) + 1;
        int discount;

        if (chance <= 1) { discount = 100; }
        else if (chance <= 10) { discount = 20; }
        else { discount = 10; }

        RewardCode rewardCode = RewardCode.builder()
                .user(currentUser)
                .code(generateUniqueCode())
                .discountPercentage(discount)
                .isUsed(false)
                .expiresAt(LocalDateTime.now().plusDays(30))
                .build();

        RewardCode savedCode = rewardCodeRepo.save(rewardCode);
        return toDto(savedCode);
    }

    @Transactional
    public void useCode(Long codeId) {
        User currentUser = authService.getAuthenticatedUser();
        RewardCode code = rewardCodeRepo.findById(codeId)
                .orElseThrow(() -> new EntityNotFoundException("Kod nie został znaleziony."));

        if (!code.getUser().equals(currentUser)) {
            throw new AccessDeniedException("Nie masz uprawnień do użycia tego kodu.");
        }
        if (code.isUsed()) {
            throw new IllegalStateException("Ten kod został już wykorzystany.");
        }

        code.setUsed(true);
        code.setUsedAt(LocalDateTime.now());
        rewardCodeRepo.save(code);
    }

    @Transactional(readOnly = true)
    public List<RewardCodeDto> getMyCodes() {
        User currentUser = authService.getAuthenticatedUser();
        return rewardCodeRepo.findByUserOrderByCreatedAtDesc(currentUser)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    private String generateUniqueCode() {
        return "VINYLOVE-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private RewardCodeDto toDto(RewardCode entity) {
        RewardCodeDto dto = new RewardCodeDto();
        dto.setId(entity.getId());
        dto.setCode(entity.getCode());
        dto.setDiscountPercentage(entity.getDiscountPercentage());
        dto.setUsed(entity.isUsed());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setExpiresAt(entity.getExpiresAt());
        return dto;
    }
}