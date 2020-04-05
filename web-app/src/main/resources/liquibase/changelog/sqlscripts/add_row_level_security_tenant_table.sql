ALTER TABLE "tenant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tenant" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_access_policy_tenant_table ON "tenant";
CREATE POLICY tenant_access_policy_tenant_table ON "tenant" TO tenant_user USING("id"=CAST(current_setting('ideakat.tenantId') AS integer));
DROP POLICY IF EXISTS system_access_policy_tenant_table ON "tenant";
CREATE POLICY system_access_policy_tenant_table ON "tenant" TO system_user USING(true);