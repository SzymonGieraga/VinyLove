package gieraga.vinylove.converter;

import gieraga.vinylove.dto.AdminUserDto;
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

    public AdminUserDto toAdminDto(User user) {
        if (user == null) return null;
        AdminUserDto dto = new AdminUserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setActive(user.isActive());
        dto.setBalance(user.getBalance());
        return dto;
    }
}
