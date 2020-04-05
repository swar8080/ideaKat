CREATE OR REPLACE PROCEDURE setup_tenant_aware_table(tableName text) LANGUAGE plpgsql
AS $$
	BEGIN
		EXECUTE format('ALTER TABLE "%s" ENABLE ROW LEVEL SECURITY', tableName);
		EXECUTE format('ALTER TABLE "%s" FORCE ROW LEVEL SECURITY', tableName);

		EXECUTE format('DROP POLICY IF EXISTS tenant_access_policy_%s ON "%s"', tableName, tableName);
		EXECUTE format('CREATE POLICY tenant_access_policy_%s ON "%s" TO tenant_user USING ("tenantId"=CAST(current_setting(''ideakat.tenantId'') AS integer))', tableName, tableName);

	    EXECUTE format('DROP POLICY IF EXISTS system_access_policy_%s ON "%s"', tableName, tableName);
	    EXECUTE format('CREATE POLICY system_access_policy_%s ON "%s" TO system_user USING (true)', tableName, tableName);

	    EXECUTE format('CREATE INDEX tenant_id_index_%s ON "%s" ("tenantId")', tableName, tableName);
	END
$$