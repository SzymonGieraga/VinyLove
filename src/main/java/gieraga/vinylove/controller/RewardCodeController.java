package gieraga.vinylove.controller;

import gieraga.vinylove.dto.RewardCodeDto;
import gieraga.vinylove.service.RewardCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reward-codes")
@RequiredArgsConstructor
public class RewardCodeController {

    private final RewardCodeService rewardCodeService;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Integer>> getGenerationStatus() {
        return ResponseEntity.ok(Map.of("availableGenerations", rewardCodeService.countAvailableGenerations()));
    }

    @PostMapping("/generate")
    public ResponseEntity<RewardCodeDto> generateCode() {
        return ResponseEntity.ok(rewardCodeService.generateCode());
    }

    @PutMapping("/{codeId}/use")
    public ResponseEntity<Void> useCode(@PathVariable Long codeId) {
        rewardCodeService.useCode(codeId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my-codes")
    public ResponseEntity<List<RewardCodeDto>> getMyCodes() {
        return ResponseEntity.ok(rewardCodeService.getMyCodes());
    }
}