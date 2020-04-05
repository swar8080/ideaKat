import * as React from 'react';
import { AuthenticationStatus } from '.';
import UserRepository from '../../repository/UserRepository';

export const useAuthentication = () => {
    const [authenticationStatus, setAuthenticationStatus] = React.useState<AuthenticationStatus>({
        isLoggedIn: false,
        user: undefined,
        isAdmin: false,
    });
    const [isLoadingAuthenticationStatus, setIsLoadingAuthenticationStatus] = React.useState(true);

    React.useEffect(() => {
        handleAuthStatusChange();
    }, []);

    const handlePermissionDenied = React.useCallback(() => {
        setAuthenticationStatus({
            isLoggedIn: false,
            user: undefined,
            isAdmin: false,
        });
        setIsLoadingAuthenticationStatus(false);
    }, [])

    function handleAuthStatusChange(){
        setIsLoadingAuthenticationStatus(true);
        UserRepository.getAuthenticationStatus()
            .then(response => {
                setAuthenticationStatus(response.data);
                setIsLoadingAuthenticationStatus(false);
            });
    }

    return {authenticationStatus, setAuthenticationStatus, handleAuthStatusChange, handlePermissionDenied, isLoadingAuthenticationStatus};
}