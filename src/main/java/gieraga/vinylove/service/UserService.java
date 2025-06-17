package gieraga.vinylove.service;

import gieraga.vinylove.converter.OfferConverter;
import gieraga.vinylove.dto.SimpleReviewDto;
import gieraga.vinylove.dto.UserProfileDto;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    private SimpleReviewDto mapToSimpleDto(RecordReview review, User author) {
        SimpleReviewDto dto = new SimpleReviewDto();
        dto.setId(review.getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        dto.setReviewType("RECORD");
        dto.setSubjectName(review.getRecordOffer().getTitle());
        dto.setReviewerUsername(author.getUsername());
        return dto;
    }

    private SimpleReviewDto mapToSimpleDto(UserReview review, User author) {
        SimpleReviewDto dto = new SimpleReviewDto();
        dto.setId(review.getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        dto.setReviewType("USER");
        dto.setSubjectName(review.getReviewedUser().getUsername());
        dto.setReviewerUsername(author.getUsername());
        return dto;
    }

    @Transactional(readOnly = true)
    public UserProfileDto getUserProfile(String username) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Użytkownik " + username + " nie został znaleziony."));

        List<RecordOffer> offers = offerRepo.findByOwnerUsernameOrderByIdDesc(username);

        List<SimpleReviewDto> writtenReviews = new ArrayList<>();
        recordReviewRepo.findByAuthorUsername(username).forEach(r -> writtenReviews.add(mapToSimpleDto(r, r.getAuthor())));
        userReviewRepo.findByReviewerUsername(username).forEach(r -> writtenReviews.add(mapToSimpleDto(r, r.getReviewer())));

        List<SimpleReviewDto> reviewsAboutUser = new ArrayList<>();
        userReviewRepo.findByReviewedUserUsername(username).forEach(r -> reviewsAboutUser.add(mapToSimpleDto(r, r.getReviewer())));

        writtenReviews.sort(Comparator.comparing(SimpleReviewDto::getCreatedAt).reversed());
        reviewsAboutUser.sort(Comparator.comparing(SimpleReviewDto::getCreatedAt).reversed());

        UserProfileDto profileDto = new UserProfileDto();
        profileDto.setUsername(user.getUsername());
        profileDto.setDescription(user.getDescription());
        profileDto.setProfileImageUrl(user.getProfileImageUrl());
        profileDto.setOffers(offers.stream().map(offerConverter::toUserOfferDto).collect(Collectors.toList()));

        // === POPRAWKA: BRAKUJĄCE LINIE KODU ZOSTAŁY DODANE ===
        profileDto.setWrittenReviews(writtenReviews);
        profileDto.setReviewsAboutUser(reviewsAboutUser);

        return profileDto;
    }
}