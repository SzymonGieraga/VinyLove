package gieraga.vinylove.controller;

import gieraga.vinylove.service.ObservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/observe")
@RequiredArgsConstructor
public class ObservationController {

    private final ObservationService observationService;

    @PostMapping("/{offerId}")
    public ResponseEntity<Void> observeOffer(@PathVariable Long offerId) {
        observationService.observeOffer(offerId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{offerId}")
    public ResponseEntity<Void> unobserveOffer(@PathVariable Long offerId) {
        observationService.unobserveOffer(offerId);
        return ResponseEntity.noContent().build();
    }
}