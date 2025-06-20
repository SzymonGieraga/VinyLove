package gieraga.vinylove.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangePasswordDto {

    @NotBlank
    private String currentPassword;

    @NotBlank
    @Size(min = 3, message = "Nowe hasło musi mieć co najmniej 6 znaków.")
    private String newPassword;
}