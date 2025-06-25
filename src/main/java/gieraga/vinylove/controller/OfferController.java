package gieraga.vinylove.controller;

import gieraga.vinylove.dto.OfferDetailsDto;
import gieraga.vinylove.dto.OfferDto;
import gieraga.vinylove.dto.UpdateOfferDto;
import gieraga.vinylove.service.OfferService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gieraga.vinylove.dto.CreateOfferDto;
import gieraga.vinylove.model.RecordOffer;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/offers")
@RequiredArgsConstructor
public class OfferController {

    private final OfferService offerService;

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<OfferDetailsDto> createOffer(
            @RequestPart("offer") CreateOfferDto dto,
            @RequestPart(value = "coverImage", required = false) MultipartFile coverImage,
            @RequestPart(value = "audioSample", required = false) MultipartFile audioSample
    ) {
        OfferDetailsDto createdOfferDto = offerService.createOffer(dto, coverImage, audioSample);
        return new ResponseEntity<>(createdOfferDto, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OfferDetailsDto> getOfferDetails(@PathVariable Long id) {
        OfferDetailsDto offerDetails = offerService.getOfferDetails(id);
        return ResponseEntity.ok(offerDetails);
    }

    @GetMapping
    public ResponseEntity<Page<OfferDto>> getOffers(
            @RequestParam(required = false) String query,
            @PageableDefault(size = 9, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<OfferDto> offers = offerService.getAvailableOffers(query, pageable);
        return ResponseEntity.ok(offers);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OfferDetailsDto> updateOffer(
            @PathVariable Long id,
            @RequestPart("data") UpdateOfferDto dto,
            @RequestPart(value = "coverImage", required = false) MultipartFile coverImage,
            @RequestPart(value = "audioSample", required = false) MultipartFile audioSample) {

        OfferDetailsDto updatedOffer = offerService.updateOffer(id, dto, coverImage, audioSample);
        return ResponseEntity.ok(updatedOffer);
    }
}