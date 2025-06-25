package gieraga.vinylove.controller;

import gieraga.vinylove.dto.FundAccountDto;
import gieraga.vinylove.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountController {

    private final UserService userService;

    @PostMapping("/fund")
    public ResponseEntity<?> fundAccount(@Valid @RequestBody FundAccountDto fundAccountDto) {
        BigDecimal newBalance = userService.fundUserAccount(fundAccountDto.getAmount());
        return ResponseEntity.ok(Map.of("newBalance", newBalance));
    }
}