package gieraga.vinylove.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String description;
    private String profileImageUrl;
    private BigDecimal balance;
}