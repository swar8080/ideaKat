/**
 * @prettier
 */

import * as qs from "qs";
import * as React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import AuthContext from "../common/auth/AuthContext";
import EditProfileController from "../pages/account/EditProfileController";
import InvitePage from "../pages/account/InvitePage";
import GroupCreationController from "../pages/group/GroupCreationController";
import GroupPage from "../pages/group/GroupPage";
import GroupTopicsController from "../pages/group/topics/GroupTopicsController";
import AdminRoute from "./AdminRoute";
import {
    CREATE_GROUP,
    EDIT_PROFILE,
    GroupRouteProps,
    GROUP_ROUTE,
    HOME,
    INVITE,
    SHOW_HELP_MODAL_URL_PARAM,
    GROUP_DISCUSSION_ROUTE,
    EDIT_GROUP
} from "./uiroutes";
import GroupEditController from "../pages/group/GroupEditController";

interface AuthenticatedControllerProps {}

const AuthenticatedController: React.FC<AuthenticatedControllerProps> = (
    props: AuthenticatedControllerProps
) => {
    const authContext = React.useContext(AuthContext);
    if (!authContext.authenticationStatus.isLoggedIn) {
        return null;
    }

    return (
        <>
            <Route
                path={EDIT_PROFILE}
                component={() => {
                    return <EditProfileController />;
                }}
            />
            <Route
                path={CREATE_GROUP}
                component={() => {
                    return <GroupCreationController />;
                }}
            />
            <Route
                path={EDIT_GROUP}
                component={(props: RouteComponentProps<GroupRouteProps>) => {
                    return <GroupEditController groupId={Number(props.match.params.groupId)} />;
                }}
            />
            <Route
                path={GROUP_DISCUSSION_ROUTE}
                component={(props: RouteComponentProps<GroupRouteProps>) => {
                    return <GroupTopicsController groupId={Number(props.match.params.groupId)} />;
                }}
            />
            <AdminRoute
                exact
                path={INVITE}
                component={() => {
                    return <InvitePage />;
                }}
            />
            <Route
                exact
                path={HOME}
                component={(props: RouteComponentProps) => {
                    const urlParams = qs.parse(props.location.search, { ignoreQueryPrefix: true });
                    const showHelpModal =
                        urlParams && urlParams[SHOW_HELP_MODAL_URL_PARAM] === "true";
                    return <GroupPage initiallyShowHelpModal={showHelpModal} />;
                }}
            />
        </>
    );
};

export default AuthenticatedController;
