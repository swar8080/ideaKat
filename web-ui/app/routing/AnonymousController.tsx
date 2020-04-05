/**
 * @prettier
 */

import * as React from "react";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";
import AuthContext from "../common/auth/AuthContext";
import ExpiredEmailConfirmationPage from "../pages/account/ExpiredEmailConfirmationPage";
import JoinByInviteController from "../pages/account/JoinByInviteController";
import LoginPage from "../pages/account/LoginPage";
import RegistrationController from "../pages/account/RegistrationController";
import RequestResetPage from "../pages/account/RequestResetPage";
import ResetPage from "../pages/account/ResetPage";
import LandingPage from "../pages/landing/LandingPage";
import {
  ConfirmationCodeRouteProps,
  EXPIRED_EMAIL_CONFIRMATION,
  HOME,
  JOIN_BY_INVITE,
  LOGIN,
  REGISTER,
  REQUEST_RESET_PASSWORD,
  RESET_PASSWORD,
  SHOW_HELP_MODAL_URL_PARAM
} from "./uiroutes";
import * as qs from "qs";

interface AnonymousControllerProps {}

const AnonymousController: React.FC<AnonymousControllerProps> = (
  props: AnonymousControllerProps
) => {
  const authContext = React.useContext(AuthContext);

  if (authContext.authenticationStatus.isLoggedIn) {
    return null;
  }

  return (
    <>
      <Switch>
        <Route
          exact
          path={HOME}
          component={() => {
            return <LandingPage />;
          }}
        />
        <Route
          path={LOGIN}
          component={({location}: RouteComponentProps) => {
            const urlParams = qs.parse(location.search, {ignoreQueryPrefix: true});
            const showHelpModal = urlParams && urlParams[SHOW_HELP_MODAL_URL_PARAM] === "true";
            return <LoginPage showHelpModalOnLogin={showHelpModal} />;
          }}
        />
        <Route
          path={REGISTER}
          component={() => {
            return <RegistrationController />;
          }}
        />
        <Route
          path={EXPIRED_EMAIL_CONFIRMATION}
          component={() => {
            return <ExpiredEmailConfirmationPage />;
          }}
        />
        <Route
          path={JOIN_BY_INVITE}
          component={(routeProps: RouteComponentProps<ConfirmationCodeRouteProps>) => {
            return (
              <JoinByInviteController confirmationCode={routeProps.match.params.confirmationCode} />
            );
          }}
        />
        <Route
          path={REQUEST_RESET_PASSWORD}
          component={() => {
            return <RequestResetPage />;
          }}
        />
        <Route
          path={RESET_PASSWORD}
          component={(routeProps: RouteComponentProps<ConfirmationCodeRouteProps>) => {
            return <ResetPage confirmationCode={routeProps.match.params.confirmationCode} />;
          }}
        />
        <Redirect to={LOGIN} />
      </Switch>
    </>
  );
};

export default AnonymousController;
