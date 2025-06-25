package gieraga.vinylove.service;

import gieraga.vinylove.converter.OfferConverter;
import gieraga.vinylove.converter.UserConverter;
import gieraga.vinylove.dto.*;
import gieraga.vinylove.model.RecordOffer;
import gieraga.vinylove.model.RecordReview;
import gieraga.vinylove.model.User;
import gieraga.vinylove.model.UserReview;
import gieraga.vinylove.repo.RecordOfferRepo;
import gieraga.vinylove.repo.RecordReviewRepo;
import gieraga.vinylove.repo.UserRepo;
import gieraga.vinylove.repo.UserReviewRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import gieraga.vinylove.service.AuthService;
import gieraga.vinylove.converter.AddressConverter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepo userRepo;
    private final RecordOfferRepo offerRepo;
    private final OfferConverter offerConverter;
    private final UserReviewRepo userReviewRepo;
    private final RecordReviewRepo recordReviewRepo;
    private final AuthService authService;
    private final FileStorageService fileStorageService;
    private final UserConverter userConverter;
    private final AddressConverter addressConverter;

    private SimpleReviewDto mapToSimpleDto(RecordReview review) {
        SimpleReviewDto dto = new SimpleReviewDto();
        User author = review.getAuthor();
        dto.setId(review.getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        dto.setReviewType("RECORD");
        dto.setReviewerUsername(review.getAuthor().getUsername());
        dto.setSubjectId(review.getRecordOffer().getId());
        dto.setSubjectName(review.getRecordOffer().getTitle());
        dto.setReviewerUsername(author.getUsername());
        dto.setReviewerProfileImageUrl(author.getProfileImageUrl());

        dto.setSubjectImageUrl(review.getRecordOffer().getCoverImageUrl());
        return dto;
    }

    private SimpleReviewDto mapToSimpleDto(UserReview review) {
        SimpleReviewDto dto = new SimpleReviewDto();
        User reviewer = review.getReviewer();
        dto.setId(review.getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        dto.setReviewType("USER");
        User reviewedUser = review.getReviewedUser();
        dto.setSubjectId(reviewedUser.getId());
        dto.setSubjectName(reviewedUser.getUsername());
        dto.setSubjectImageUrl(reviewedUser.getProfileImageUrl());
        dto.setReviewerUsername(reviewer.getUsername());
        dto.setReviewerProfileImageUrl(reviewer.getProfileImageUrl());
        return dto;
    }

    @Transactional(readOnly = true)
    public Page<SimpleReviewDto> getReviewsForProfile(String username, String viewMode, String reviewType, Pageable pageable) {

        if ("about".equals(viewMode)) {
            switch (reviewType) {
                case "RECORD":
                    return recordReviewRepo.findByRecordOfferOwnerUsername(username, pageable).map(this::mapToSimpleDto);
                case "USER":
                    return userReviewRepo.findByReviewedUserUsername(username, pageable).map(this::mapToSimpleDto);
                default: // "ALL"
                    List<SimpleReviewDto> allAboutReviews = new ArrayList<>();
                    recordReviewRepo.findByRecordOfferOwnerUsername(username).forEach(r -> allAboutReviews.add(mapToSimpleDto(r)));
                    userReviewRepo.findByReviewedUserUsername(username).forEach(r -> allAboutReviews.add(mapToSimpleDto(r)));
                    allAboutReviews.sort(Comparator.comparing(SimpleReviewDto::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())));
                    return createPageFromList(allAboutReviews, pageable);
            }
        }
        else {
            switch (reviewType) {
                case "RECORD":
                    return recordReviewRepo.findByAuthorUsername(username, pageable).map(this::mapToSimpleDto);
                case "USER":
                    return userReviewRepo.findByReviewerUsername(username, pageable).map(this::mapToSimpleDto);
                default:
                    List<SimpleReviewDto> allWrittenReviews = new ArrayList<>();
                    recordReviewRepo.findByAuthorUsername(username).forEach(r -> allWrittenReviews.add(mapToSimpleDto(r)));
                    userReviewRepo.findByReviewerUsername(username).forEach(r -> allWrittenReviews.add(mapToSimpleDto(r)));
                    allWrittenReviews.sort(Comparator.comparing(SimpleReviewDto::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())));
                    return createPageFromList(allWrittenReviews, pageable);
            }
        }
    }

    private <T> Page<T> createPageFromList(List<T> list, Pageable pageable) {
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), list.size());

        if (start > list.size()) {
            return new PageImpl<>(List.of(), pageable, list.size());
        }

        return new PageImpl<>(list.subList(start, end), pageable, list.size());
    }

    @Transactional(readOnly = true)
    public UserProfileDto getUserProfile(String username) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Użytkownik " + username + " nie został znaleziony."));

        List<RecordOffer> offers = offerRepo.findByOwnerUsernameOrderByIdDesc(username);

        List<SimpleReviewDto> writtenReviews = new ArrayList<>();
        recordReviewRepo.findByAuthorUsername(username).forEach(r -> writtenReviews.add(mapToSimpleDto(r)));
        userReviewRepo.findByReviewerUsername(username).forEach(r -> writtenReviews.add(mapToSimpleDto(r)));

        List<SimpleReviewDto> reviewsAboutUser = new ArrayList<>();
        recordReviewRepo.findByRecordOfferOwnerUsername(username).forEach(r -> reviewsAboutUser.add(mapToSimpleDto(r)));
        userReviewRepo.findByReviewedUserUsername(username).forEach(r -> reviewsAboutUser.add(mapToSimpleDto(r)));

        writtenReviews.sort(Comparator.comparing(SimpleReviewDto::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())));
        reviewsAboutUser.sort(Comparator.comparing(SimpleReviewDto::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())));

        UserProfileDto profileDto = new UserProfileDto();
        profileDto.setUsername(user.getUsername());
        profileDto.setDescription(user.getDescription());
        profileDto.setProfileImageUrl(user.getProfileImageUrl());
        profileDto.setOffers(offers.stream().map(offerConverter::toUserOfferDto).collect(Collectors.toList()));
        profileDto.setWrittenReviews(writtenReviews);
        profileDto.setReviewsAboutUser(reviewsAboutUser);

        return profileDto;
    }
    @Transactional
    public UserDto updateUserProfile(String description, MultipartFile profileImage) {
        User user = authService.getAuthenticatedUser();
        if (user == null) {
            throw new EntityNotFoundException("Użytkownik nie jest zalogowany.");
        }

        if (description != null) {
            user.setDescription(description);
        }

        if (profileImage != null && !profileImage.isEmpty()) {
            String imageUrl = fileStorageService.store(profileImage);
            user.setProfileImageUrl(imageUrl);
        }

        User updatedUser = userRepo.save(user);

        return userConverter.toDto(updatedUser);
    }

    @Transactional(readOnly = true)
    public List<AddressDto> getAddressesForCurrentUser() {
        User currentUser = authService.getAuthenticatedUser();
        if (currentUser == null) {
            return List.of();
        }
        return currentUser.getAddresses().stream()
                .map(addressConverter::toDto)
                .collect(Collectors.toList());
    }
    @Transactional
    public BigDecimal fundUserAccount(BigDecimal amount) {
        User currentUser = authService.getAuthenticatedUser();

        BigDecimal newBalance = currentUser.getBalance().add(amount);
        currentUser.setBalance(newBalance);

        userRepo.save(currentUser);

        return newBalance;
    }


    @Transactional(readOnly = true)
    public List<UserOfferDto> getObservedOffersForCurrentUser() {
        User currentUser = authService.getAuthenticatedUser();
        return currentUser.getObservedOffers().stream()
                .map(offerConverter::toUserOfferDto)
                .collect(Collectors.toList());
    }
}