package gieraga.vinylove.service;

import gieraga.vinylove.dto.ParcelLockerDto;
import gieraga.vinylove.model.ParcelLocker;
import gieraga.vinylove.repo.ParcelLockerRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParcelLockerService {

    private final ParcelLockerRepo parcelLockerRepo;

    @Transactional(readOnly = true)
    public List<ParcelLockerDto> getAllLockers() {
        return parcelLockerRepo.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ParcelLockerDto createLocker(ParcelLockerDto dto) {
        ParcelLocker locker = ParcelLocker.builder()
                .name(dto.getName())
                .address(dto.getAddress())
                .latitude(dto.getLat())
                .longitude(dto.getLng())
                .build();
        ParcelLocker savedLocker = parcelLockerRepo.save(locker);
        return toDto(savedLocker);
    }

    private ParcelLockerDto toDto(ParcelLocker locker) {
        ParcelLockerDto dto = new ParcelLockerDto();
        dto.setId(locker.getId());
        dto.setName(locker.getName());
        dto.setAddress(locker.getAddress());
        dto.setLat(locker.getLatitude());
        dto.setLng(locker.getLongitude());
        return dto;
    }
}