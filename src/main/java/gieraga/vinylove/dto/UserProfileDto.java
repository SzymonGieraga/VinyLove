package gieraga.vinylove.dto;

import lombok.Data;
import java.util.List;

@Data
public class UserProfileDto {
    private String username;
    private String description;
    private String profileImageUrl;
    private List<UserOfferDto> offers;
}