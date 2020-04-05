package org.ideakat.webapp.auth;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;
import java.util.Stack;
import java.util.function.Supplier;

public class TenantContextHolder {

    public static final Long SYSTEM_TENANT_ID = -1L;

    private static ThreadLocal<TenantContextHolder> INSTANCE = new ThreadLocal<>();
    private Stack<Long> tenantContextStack;

    public static Long getTenantIdentifier(){
        TenantContextHolder instance = getInstance();

        if (!instance.tenantContextStack.isEmpty()){
            return instance.tenantContextStack.peek();
        }

        Optional<Long> loggedInUserTenantIdentifier = getLoggedInUsersTenantIdentifier();
        if (loggedInUserTenantIdentifier.isPresent()){
            return loggedInUserTenantIdentifier.get();
        }
        
        throw new AccessDeniedException("Running as system must be explicit when the user is not authenticated");
    }

    public static Optional<Long> getLoggedInUsersTenantIdentifier(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof AuthenticatedUser){
            AuthenticatedUser authenticatedUser = (AuthenticatedUser)auth.getPrincipal();
            return Optional.of(authenticatedUser.getUser().getTenantId());
        }
        else {
            return Optional.empty();
        }
    }

    public static <E extends Throwable> void runAsTenant(Long identifier, Runnable operation) throws E {
        if (identifier == null || SYSTEM_TENANT_ID.equals(identifier)){
            throw new IllegalArgumentException("Invalid tenant identifier: " + identifier);
        }

        TenantContextHolder instance = getInstance();
        instance.tenantContextStack.push(identifier);
        try {
            operation.run();
        }
        finally {
            instance.tenantContextStack.pop();
        }
    }

    public static <E extends Throwable, R> R runAsSystem(Supplier<R> operation) throws E {
        TenantContextHolder instance = getInstance();
        instance.tenantContextStack.push(SYSTEM_TENANT_ID);
        try {
            return operation.get();
        }
        finally {
            instance.tenantContextStack.pop();
        }
    }

    public static void clear() {
        INSTANCE.remove();
    }

    private static TenantContextHolder getInstance(){
        if (INSTANCE.get() == null){
            INSTANCE.set(new TenantContextHolder());
        }
        return INSTANCE.get();
    }

    private TenantContextHolder(){
        tenantContextStack = new Stack<>();
    }
}
