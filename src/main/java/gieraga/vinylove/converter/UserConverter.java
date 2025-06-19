package gieraga.vinylove.converter;

import gieraga.vinylove.dto.UserDto;
import gieraga.vinylove.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserConverter {
    public UserDto toDto(User user) {
        if (user == null) return null;
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setDescription(user.getDescription());
        dto.setProfileImageUrl(user.getProfileImageUrl());
        dto.setBalance(user.getBalance());
        return dto;
    }
}
