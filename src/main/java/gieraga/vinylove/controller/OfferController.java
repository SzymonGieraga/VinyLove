package gieraga.vinylove.controller;

import gieraga.vinylove.dto.OfferDetailsDto;
import gieraga.vinylove.dto.OfferDto;
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

    @GetMapping
    public ResponseEntity<Page<OfferDto>> getOffers(
            @PageableDefault(size = 9, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<OfferDto> offers = offerService.getAvailableOffers(pageable);
        return ResponseEntity.ok(offers);
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<RecordOffer> createOffer(
            @RequestPart("offer") CreateOfferDto dto,
            @RequestPart(value = "coverImage", required = false) MultipartFile coverImage,
            @RequestPart(value = "audioSample", required = false) MultipartFile audioSample
    ) {
        RecordOffer createdOffer = offerService.createOffer(dto, coverImage, audioSample);
        return new ResponseEntity<>(createdOffer, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OfferDetailsDto> getOfferDetails(@PathVariable Long id) {
        OfferDetailsDto offerDetails = offerService.getOfferById(id);
        return ResponseEntity.ok(offerDetails);
    }
}