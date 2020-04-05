package org.ideakat.webapp.persistence;

import org.ideakat.domain.entities.Tenant;
import org.ideakat.domain.entities.group.Group;
import org.ideakat.domain.entities.user.User;
import org.ideakat.domain.repositories.TenantRepository;
import org.ideakat.domain.repositories.group.GroupRepository;
import org.ideakat.domain.repositories.user.UserRepository;
import org.junit.Before;
import org.springframework.beans.factory.annotation.Autowired;

public abstract class PersistenceBaseTest {

    protected Tenant tenant;
    protected Long tenantId;
    protected User user;
    protected Group group;

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Before
    public void setUp(){
        tenant = tenantRepository.save(Tenant.builder().tenantName("test tenant").build());
        tenantId = tenant.getId();

        user = User.UserBuilder.aUser()
                .withName("testuser")
                .withEmail("email")
                .withPassword("password")
                .withIsAdmin(false)
                .withIsConfirmed(true)
                .withImageUrl("image url")
                .withTenantId(tenantId)
                .build();
        user = userRepository.save(user);

        group = Group.GroupBuilder.aGroup()
                .withGroupName("test group")
                .withImageUrl("imageurl")
                .withDescription("description")
                .withCreatedBy(user)
                .withTenantId(tenantId)
                .build();
        group = groupRepository.save(group);
    }
}
