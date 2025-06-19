package gieraga.vinylove.controller;

import gieraga.vinylove.dto.RentalDto;
import gieraga.vinylove.dto.RentalRequestDto;
import gieraga.vinylove.model.Rental;
import gieraga.vinylove.model.RentalStatus;
import gieraga.vinylove.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @PostMapping
    public ResponseEntity<RentalDto> createRental(@RequestBody RentalRequestDto rentalRequestDto) {
        RentalDto newRentalDto = rentalService.createRental(rentalRequestDto);
        return new ResponseEntity<>(newRentalDto, HttpStatus.CREATED);
    }

    @PutMapping("/{rentalId}/status")
    public ResponseEntity<Rental> updateStatus(
            @PathVariable Long rentalId,
            @RequestBody RentalStatus newStatus) {
        Rental updatedRental = rentalService.updateRentalStatus(rentalId, newStatus);
        return ResponseEntity.ok(updatedRental);
    }
}