package org.ideakat.webapp.persistence;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories({"org.ideakat.webapp", "org.ideakat.domain.repositories"})
@EntityScan("org.ideakat.domain.entities")
public class PersistenceConfig {
}
