CREATE OR REPLACE PROCEDURE create_role_if_not_exists(rolename NAME) AS
$$
BEGIN
    IF NOT EXISTS (SELECT * FROM pg_roles WHERE rolname = rolename) THEN
        EXECUTE format('CREATE ROLE %I', rolename);
    END IF;
END;
$$
LANGUAGE plpgsql;