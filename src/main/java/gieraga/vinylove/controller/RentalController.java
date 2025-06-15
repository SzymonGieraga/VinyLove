package gieraga.vinylove.controller;

import gieraga.vinylove.dto.RentalRequestDto;
import gieraga.vinylove.model.Rental;
import gieraga.vinylove.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @PostMapping
    public ResponseEntity<Rental> createRental(@RequestBody RentalRequestDto rentalRequestDto) {
        Rental newRental = rentalService.createRental(rentalRequestDto);
        return new ResponseEntity<>(newRental, HttpStatus.CREATED);
    }
}