package gieraga.vinylove.service;

import gieraga.vinylove.converter.OfferConverter;
import gieraga.vinylove.dto.UserProfileDto;
import gieraga.vinylove.model.RecordOffer;
import gieraga.vinylove.model.User;
import gieraga.vinylove.repo.RecordOfferRepo;
import gieraga.vinylove.repo.UserRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepo userRepo;
    private final RecordOfferRepo offerRepo;
    private final OfferConverter offerConverter;

    @Transactional(readOnly = true)
    public UserProfileDto getUserProfile(String username) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Użytkownik " + username + " nie został znaleziony."));

        List<RecordOffer> offers = offerRepo.findByOwnerUsernameOrderByIdDesc(username);

        UserProfileDto profileDto = new UserProfileDto();
        profileDto.setUsername(user.getUsername());
        profileDto.setDescription(user.getDescription());
        profileDto.setProfileImageUrl(user.getProfileImageUrl());
        profileDto.setOffers(offers.stream().map(offerConverter::toUserOfferDto).collect(Collectors.toList()));

        return profileDto;
    }
}