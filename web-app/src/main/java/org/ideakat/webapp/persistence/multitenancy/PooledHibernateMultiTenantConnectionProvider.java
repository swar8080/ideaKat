package org.ideakat.webapp.persistence.multitenancy;

import org.hibernate.engine.jdbc.connections.spi.AbstractMultiTenantConnectionProvider;
import org.hibernate.engine.jdbc.connections.spi.ConnectionProvider;
import org.ideakat.webapp.auth.TenantContextHolder;

import java.sql.Connection;
import java.sql.SQLException;

public class PooledHibernateMultiTenantConnectionProvider extends AbstractMultiTenantConnectionProvider {

    private SpringGeneratedConnectionProvider connectionProvider;

    public PooledHibernateMultiTenantConnectionProvider(){
        connectionProvider = new SpringGeneratedConnectionProvider();
    }

    @Override
    public Connection getAnyConnection() throws SQLException {
        return getTenantAwareConnection();
    }

    @Override
    public Connection getConnection(String tenantIdentifier) throws SQLException {
        return getTenantAwareConnection();
    }

    protected Connection getTenantAwareConnection() throws SQLException {
        Connection connection = connectionProvider.getConnection();
        String tenantContextSql = getTenantContextSql();
        connection.createStatement().execute(tenantContextSql);
        return connection;
    }

    private String getTenantContextSql(){
        Long tenantIdentifier = TenantContextHolder.getTenantIdentifier();
        if (tenantIdentifier == null){
            throw new IllegalStateException("Tenant identifier should not be null");
        }

        if (TenantContextHolder.SYSTEM_TENANT_ID.equals(tenantIdentifier)){
            return "SET ROLE " + SpringGeneratedDbConfigHolder.INSTANCE.getSystemDbRole() + ";";
        }
        else {
            return String.format("SET ROLE %s; SET SESSION \"ideakat.tenantId\" = %s;", SpringGeneratedDbConfigHolder.INSTANCE.getTenantRole(), tenantIdentifier);
        }
    }

    @Override
    protected ConnectionProvider getAnyConnectionProvider() {
        return connectionProvider;
    }

    @Override
    protected ConnectionProvider selectConnectionProvider(String ignoredTenantIdentifier) {
        return connectionProvider;
    }
}
