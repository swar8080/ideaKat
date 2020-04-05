package org.ideakat.domain.repositories.user;

import org.ideakat.domain.entities.user.UserEmailConfirmation;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.Optional;

@NoRepositoryBean
public interface CommonEmailConfirmationRepository<EC extends UserEmailConfirmation> extends CrudRepository<EC, Long> {
    Optional<EC> findOneByConfirmationCodeAndValidTrue(String confirmationCode);
    void deleteByEmail(String email);
}
