package gieraga.vinylove.controller;

import gieraga.vinylove.dto.ParcelLockerDto;
import gieraga.vinylove.service.ParcelLockerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parcel-lockers")
@RequiredArgsConstructor
public class ParcelLockerController {

    private final ParcelLockerService parcelLockerService;

    @GetMapping
    public ResponseEntity<List<ParcelLockerDto>> getAllLockers() {
        return ResponseEntity.ok(parcelLockerService.getAllLockers());
    }

    @PostMapping
    public ResponseEntity<ParcelLockerDto> createLocker(@RequestBody ParcelLockerDto lockerDto) {
        ParcelLockerDto createdLocker = parcelLockerService.createLocker(lockerDto);
        return new ResponseEntity<>(createdLocker, HttpStatus.CREATED);
    }
}