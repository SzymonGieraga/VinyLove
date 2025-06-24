package gieraga.vinylove.dto;

import gieraga.vinylove.model.UserRole;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class AdminUserDto {
    private Long id;
    private String username;
    private String email;
    private UserRole role;
    private boolean active;
    private BigDecimal balance;
}