package org.ideakat.webapp.persistence;

import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootConfiguration
@EnableJpaRepositories({"org.ideakat.domain", "org.ideakat.webapp.persistence.repositories"})
@EntityScan("org.ideakat.domain.entities")
@ComponentScan({"org.ideakat.domain.repositories", "org.ideakat.webapp.persistence.repositories"})
public class PersistenceTestConfig {
}