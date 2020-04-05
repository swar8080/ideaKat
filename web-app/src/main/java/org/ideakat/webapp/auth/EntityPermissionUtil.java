package org.ideakat.webapp.auth;

import org.ideakat.domain.entities.HasOwner;
import org.ideakat.domain.entities.user.User;

public class EntityPermissionUtil {

    public static boolean isAdminOrOwner(User user, HasOwner target){
        return isAdminOrOwner(user, target.getOwnerUserId());
    }

    public static boolean isAdminOrOwner(User user, Long ownerId){
        return (user.isAdmin() && user.isConfirmed()) || user.getId().equals(ownerId);
    }

    private EntityPermissionUtil(){}
}
