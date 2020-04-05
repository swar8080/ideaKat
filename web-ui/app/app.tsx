/**
 * @prettier
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import "./app.scss";
import AuthContext from "./common/auth/AuthContext";
import { useAuthentication } from "./common/auth/useAuthentication";
import AnonymousController from "./routing/AnonymousController";
import AuthenticatedController from "./routing/AuthenticatedController";
import NavigationHeader from "./pages/header/NavigationHeader";
import useTabTitle from "./routing/useTabTitle";

const App = () => {
  useTabTitle("ideaKat");
  const {
    authenticationStatus,
    setAuthenticationStatus,
    handleAuthStatusChange,
    handlePermissionDenied,
    isLoadingAuthenticationStatus
  } = useAuthentication();

  const authContext = {
    authenticationStatus,
    setAuthenticationStatus,
    handleAuthStatusChange,
    handlePermissionDenied
  };

  return (
    <AuthContext.Provider value={authContext}>
      <div className="app">
        {!isLoadingAuthenticationStatus && (
          <HashRouter>
            <NavigationHeader />
            <AnonymousController />
            <AuthenticatedController />
          </HashRouter>
        )}
      </div>
    </AuthContext.Provider>
  );
};

document.getElementById("shell").style.display = "none";
ReactDOM.render(<App />, document.getElementById("react"));
