package gieraga.vinylove.converter;

import gieraga.vinylove.dto.AdminRecordReviewDto;
import gieraga.vinylove.dto.AdminUserReviewDto;
import gieraga.vinylove.model.RecordReview;
import gieraga.vinylove.model.UserReview;

import org.springframework.stereotype.Component;

@Component
public class ReviewConverter {

    public AdminRecordReviewDto toAdminDto(RecordReview review) {
        AdminRecordReviewDto dto = new AdminRecordReviewDto();
        dto.setId(review.getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        dto.setAuthorUsername(review.getAuthor().getUsername());
        dto.setOfferId(review.getRecordOffer().getId());
        dto.setOfferTitle(review.getRecordOffer().getTitle());
        return dto;
    }

    public AdminUserReviewDto toAdminDto(UserReview review) {
        AdminUserReviewDto dto = new AdminUserReviewDto();
        dto.setId(review.getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        dto.setReviewerUsername(review.getReviewer().getUsername());
        dto.setReviewedUserUsername(review.getReviewedUser().getUsername());
        return dto;
    }
}
