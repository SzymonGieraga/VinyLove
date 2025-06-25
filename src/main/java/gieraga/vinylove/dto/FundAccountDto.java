package gieraga.vinylove.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class FundAccountDto {
    @NotNull
    @DecimalMin(value = "0.01", message = "Kwota doładowania musi być dodatnia.")
    private BigDecimal amount;
}