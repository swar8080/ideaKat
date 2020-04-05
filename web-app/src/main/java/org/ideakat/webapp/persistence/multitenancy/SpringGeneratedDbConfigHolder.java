package org.ideakat.webapp.persistence.multitenancy;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class SpringGeneratedDbConfigHolder {
    static SpringGeneratedDbConfigHolder INSTANCE;

    private DataSource dataSource;

    @Value("${ideakat.db.system-role}")
    private String systemDbRole;

    @Value("${ideakat.db.tenant-role}")
    private String tenantRole;

    public DataSource getDataSource() {
        return dataSource;
    }

    public String getSystemDbRole() {
        return systemDbRole;
    }

    public String getTenantRole() {
        return tenantRole;
    }

    @Bean
    protected SpringGeneratedDbConfigHolder _initDataSourceConfig(DataSource dataSource){
        SpringGeneratedDbConfigHolder config = new SpringGeneratedDbConfigHolder();
        config.dataSource = dataSource;
        INSTANCE = config;
        return INSTANCE;
    }

    SpringGeneratedDbConfigHolder(){}
}
