package org.ideakat.domain.repositories.user;

import org.ideakat.domain.entities.user.User;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends CrudRepository<User, Long> {
    Optional<User> findOneByEmailIgnoreCase(String email);

    Optional<User> findOneByEmailIgnoreCaseAndIsAdminTrueAndIsConfirmedFalse(String email);

    boolean existsByEmailIgnoreCase(String email);

    @Modifying
    @Query("UPDATE User u SET u.name = :displayName, u.imageUrl = :profileImageUrl WHERE u.id = :userId")
    void updateUserProfile(
            @Param("displayName") String displayName,
            @Param("profileImageUrl") String profileImageUrl,
            @Param("userId") Long userId
    );
}
