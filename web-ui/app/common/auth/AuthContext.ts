import * as React from 'react';
import { AuthenticationStatus } from '.';

interface AuthContextValues {
    authenticationStatus: AuthenticationStatus,
    setAuthenticationStatus: (status: AuthenticationStatus) => void,
    handleAuthStatusChange: () => void,
    handlePermissionDenied: () => void
}

const AuthContext = React.createContext<AuthContextValues>(undefined);
export default AuthContext;
