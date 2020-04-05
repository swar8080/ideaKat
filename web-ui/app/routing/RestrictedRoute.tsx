import * as React from "react";
import { RouteProps, Route, Redirect } from "react-router";
import { useRouteMatch } from "react-router-dom";

interface RestrictedRouteProps extends RouteProps {
    canAccess: boolean;
    redirectPath?: string;
}

const RestrictedRoute: React.FC<RestrictedRouteProps> = ({
    canAccess,
    redirectPath,
    ...routeProps
}) => {
    const routeMatch = useRouteMatch(routeProps.path);

    if (canAccess) {
        return <Route {...routeProps} />;
    } else if (routeMatch && (!routeProps.exact || routeMatch.isExact)) {
        return (
            <Redirect
                from={routeProps.path as string}
                to={redirectPath}
                exact={routeProps.exact}
                strict={routeProps.strict}
            />
        );
    } else {
        return null;
    }
};

export default RestrictedRoute;
