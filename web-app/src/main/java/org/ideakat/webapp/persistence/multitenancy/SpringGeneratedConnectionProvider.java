package org.ideakat.webapp.persistence.multitenancy;

import com.zaxxer.hikari.HikariDataSource;
import org.hibernate.engine.jdbc.connections.spi.ConnectionProvider;
import org.hibernate.service.UnknownUnwrapTypeException;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@Configuration
public class SpringGeneratedConnectionProvider implements ConnectionProvider {

    private HikariDataSource hds;

    @Override
    public Connection getConnection() throws SQLException
    {
        Connection conn = null;
        if (getDataSource() != null) {
            conn = getDataSource().getConnection();
        }

        return conn;
    }

    @Override
    public void closeConnection(Connection conn) throws SQLException
    {
        conn.close();
    }

    @Override
    public boolean supportsAggressiveRelease()
    {
        return false;
    }

    @Override
    @SuppressWarnings("rawtypes")
    public boolean isUnwrappableAs(Class unwrapType)
    {
        return ConnectionProvider.class.equals(unwrapType) || SpringGeneratedConnectionProvider.class.isAssignableFrom(unwrapType);
    }

    @Override
    @SuppressWarnings("unchecked")
    public <T> T unwrap(Class<T> unwrapType)
    {
        if ( ConnectionProvider.class.equals( unwrapType ) ||
                SpringGeneratedConnectionProvider.class.isAssignableFrom( unwrapType ) ) {
            return (T) this;
        }
        else if ( DataSource.class.isAssignableFrom( unwrapType ) ) {
            return (T) getDataSource();
        }
        else {
            throw new UnknownUnwrapTypeException( unwrapType );
        }
    }

    private HikariDataSource getDataSource(){
        if (hds != null){
            return hds;
        }
        else if (SpringGeneratedDbConfigHolder.INSTANCE.getDataSource() instanceof HikariDataSource){
            hds = (HikariDataSource) SpringGeneratedDbConfigHolder.INSTANCE.getDataSource();
            return hds;
        }
        else {
            return null;
        }
    }
}
