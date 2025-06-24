package gieraga.vinylove.service;

import gieraga.vinylove.converter.ReviewConverter;
import gieraga.vinylove.converter.UserConverter;
import gieraga.vinylove.dto.AdminRecordReviewDto;
import gieraga.vinylove.dto.AdminUserDto;
import gieraga.vinylove.dto.AdminUserReviewDto;
import gieraga.vinylove.model.User;
import gieraga.vinylove.repo.RecordReviewRepo;
import gieraga.vinylove.repo.UserRepo;
import gieraga.vinylove.repo.UserReviewRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepo userRepo;
    private final UserConverter userConverter;
    private final ReviewConverter reviewConverter;
    private final RecordReviewRepo recordReviewRepo;
    private final UserReviewRepo userReviewRepo;
    private final ReviewService reviewService;

    @Transactional(readOnly = true)
    public Page<AdminUserDto> getAllUsers(Pageable pageable) {
        return userRepo.findAll(pageable).map(userConverter::toAdminDto);
    }

    @Transactional(readOnly = true)
    public Page<AdminRecordReviewDto> getAllRecordReviews(Pageable pageable) {
        return recordReviewRepo.findAll(pageable).map(reviewConverter::toAdminDto);
    }

    @Transactional(readOnly = true)
    public Page<AdminUserReviewDto> getAllUserReviews(Pageable pageable) {
        return userReviewRepo.findAll(pageable).map(reviewConverter::toAdminDto);
    }


    @Transactional
    public User toggleUserStatus(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Użytkownik nie znaleziony."));

        user.setActive(!user.isActive());
        return userRepo.save(user);
    }

    @Transactional
    public void deleteRecordReview(Long reviewId) {
        reviewService.deleteRecordReview(reviewId);
    }

    @Transactional
    public void deleteUserReview(Long reviewId) {
        reviewService.deleteUserReview(reviewId);
    }

}