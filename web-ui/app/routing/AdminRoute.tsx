import * as React from 'react';
import AuthContext from '../common/auth/AuthContext';
import { HOME, LOGIN } from './uiroutes';
import { RouteProps } from 'react-router-dom';
import RestrictedRoute from './RestrictedRoute';

const AdminRoute: React.FC<RouteProps> = (routeProps) => {
    const authContext = React.useContext(AuthContext);

    return <RestrictedRoute 
        canAccess={authContext.authenticationStatus.isAdmin}
        redirectPath={authContext.authenticationStatus.isLoggedIn? HOME : LOGIN}
        {...routeProps}
    />
};

export default AdminRoute;